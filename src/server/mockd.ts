import { AddressInfo, Server, Socket } from "net"
import { Writable } from "stream"

export class MockDaemon {
    matchUrl = new Map<string, Matcher>()
    socket: Server

    constructor(port?: number) {
        console.log("*** MOCK DAEMON IS STARTING")
        this.socket = new Server()
        this.socket.on('connection', (client: Socket) => {
            this.handleConnection(client)
        })
        this.socket.listen(port)
        console.log(`*** MOCK DAEMON IS LISTENING ON PORT ${this.port}`)
    }

    get port(): number {
        return (this.socket.address() as AddressInfo).port
    }

    get expect(): Matcher {
        return new Matcher(this)
    }

    private handleConnection(client: Socket) {
        console.log("*** GOT CONNECTION")
        const parser = new HTTPParser()
        client.on("data", (data: Buffer) => {
            for (const byte of data) {
                parser.handleByte(byte)
                if (parser.state === -1) {
                    const response = parser.getResponse()
                    console.log(`*** REQUEST ON 'http://${response.headers.get("host")}${response.path}'`)
                    const matcher = this.getMatcher(response)
                    console.log(`*** GOT DATA FROM CLIENT, CHECKING EXPECTATIONS`)
                    matcher._checkExpectations(response)
                    matcher._respond(client)
                    client.destroy()
                }
            }
        })
        client.on("close", () => {
            console.log("client closed")
            this.socket.close()
        })
    }

    private getMatcher(response: Response): Matcher {
        const matcher = this.matchUrl.get(`${response.method}:${response.path}`)
        if (matcher === undefined) {
            client.destroy()
            let str = ""
            for (const url of this.matchUrl.keys()) {
                str = `${str} '${url}'`
            }
            throw Error(`Client requested undefined path '${response.path}'. Expected one of ${str}`)
        }
        return matcher
    }

}

class Matcher {
    private mocker: MockDaemon
    private expectations = new Array<(response: Response) => void>()
    private response?: (output: Writable) => void

    constructor(mocker: MockDaemon) {
        this.mocker = mocker
    }

    get(url: string) {
        return this.expectMethodAndURL("GET", url)
    }
    post(url: string) {
        return this.expectMethodAndURL("POST", url)
    }
    header(field: string, value: string) {
        return this.expectHeader(field, value)
    }
    basicAuth(username: string, password: string) {
        return this.expectHeader(
            "Authorization",
            `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        )
    }
    content(content: string) {
        return this.expectContent(content)
    }
    respond(status: number, content?: string | Object, contentType?: string) {
        this.response = (output: Writable) => {
            console.log(`*** RESPOND STATUS ${status}`)
            let contentLength
            if (content !== undefined) {
                if (typeof content === 'object') {
                    content = JSON.stringify(content)
                    if (contentType === undefined)
                        contentType = "application/json"
                }
                contentLength = Buffer.from(content as string).length
            }
            contentType = contentType !== undefined ? `Content-Type: ${contentType}\r\n` : ""
            contentLength = contentLength !== undefined ? `Content-Length: ${contentLength}\r\n` : ""
            output.write(`HTTP/1.1 ${status} OK\r\n${contentType}${contentLength}\r\n${content ?? ''}`)
        }
    }

    private expectMethodAndURL(method: string, url: string) {
        console.log(`*** REGISTER ${method} ${url}`)

        if (this.mocker.matchUrl.has(`${method}:${url}`))
            throw Error(`Registering the same URL ('${url}') is not supported yet.`)
        this.mocker.matchUrl.set(`${method}:${url}`, this)

        this.expectations.push((response: Response) => {
            if (response.method !== method)
                throw Error(`Expected method to be '$method' but got '${response.method}'.`)
        })

        return this
    }

    private expectHeader(field: string, value: string) {
        const fieldName = field.toLowerCase()
        console.log(`*** REGISTER HEADER '${fieldName}' '${value}'`)

        this.expectations.push((response: Response) => {
            const fieldValue = response.headers.get(fieldName)
            if (value === undefined) {
                throw Error(`Missing field '${fieldName}' in header.`)
            }
            if (fieldValue !== value) {
                throw Error(`Expected field '${fieldName}' to be '${value}' but got '${fieldValue}'.`)
            }
        })

        return this
    }

    private expectContent(content: string) {
        console.log(`*** REGISTER CONTENT ${content}`)

        this.expectations.push((response: Response) => {
            if (content !== response.body)
                throw Error(`Expected body '${content}' but got '${response.body}'`)
        })

        return this
    }

    _checkExpectations(response: Response) {
        for (const expectation of this.expectations) {
            expectation(response)
        }
    }

    _respond(output: Writable) {
        if (this.response !== undefined)
            this.response(output)
    }
}

class HTTPParser {
    state = 0
    method = ""
    path = ""
    version = ""
    headers = new Map<string, string>()
    field = ""
    value = ""
    contentLength = 0
    body = ""

    handleByte(byte: number) {
        const char = String.fromCharCode(byte)
        // console.log(`state ${this.state} char ${byte} ${char}`)

        switch (this.state) {
            // METHOD
            case 0:
                switch (char) {
                    case ' ':
                        this.state = 1
                        break
                    default:
                        this.method += char
                }
                break
            // PATH
            case 1:
                switch (char) {
                    case ' ':
                        this.state = 2
                        break
                    default:
                        this.path += char
                }
                break
            // VERSION
            case 2:
                switch (char) {
                    case '\r':
                        this.state = 3
                        break
                    default:
                        this.version += char
                }
                break
            case 3:
                switch (char) {
                    case '\n':
                        this.state = 4
                        break
                    default:
                        throw Error("Missing \\n after \\r in HTTP start line")
                }
                break
            // HEADER FIELD
            case 4:
                switch (char) {
                    case '\r':
                        this.state = 8
                        break
                    case ':':
                        this.state = 5
                        break
                    default:
                        this.field += char
                }
                break
            case 5:
                switch (char) {
                    case ' ':
                        this.state = 6
                        break
                    default:
                        throw Error("missing ' ' after ':' in HTTP header line")
                }
                break
            // HEADER VALUE
            case 6:
                switch (char) {
                    case '\r':
                        this.state = 7
                        break
                    default:
                        this.value += char
                        break
                }
                break
            case 7:
                if (char === '\n') {
                    this.state = 4
                    this.field = this.field.toLowerCase()
                    console.log(`*** MOCKD GOT HEADER ${this.field}: '${this.value}'`)
                    this.headers.set(this.field, this.value)
                    if (this.field == "content-length")
                        this.contentLength = Number.parseInt(this.value)
                    this.field = ""
                    this.value = ""
                } else {
                    throw Error("Missing \\n after \\r in HTTP header line")
                }
                break
            // END OF HEADER
            case 8:
                if (char != '\n')
                    throw Error("Missing \\n after \\r in HTTP header line")
                if (this.contentLength > 0) {
                    this.state = 9
                } else {
                    this.state = -1
                }
                break
            // BODY
            case 9:
                this.body += char
                if (this.body.length === this.contentLength) {
                    this.state = -1
                }
                break
        }
    }

    getResponse(): Response {
        return {
            method: this.method,
            path: this.path,
            version: this.version,
            headers: this.headers,
            body: this.body
        }
    }
}

interface Response {
    method: string
    path: string
    version: string
    headers: Map<string, string>
    body: string
}
