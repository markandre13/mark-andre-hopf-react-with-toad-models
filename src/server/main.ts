import * as fs from "fs"
import { MockDaemon } from "./mockd"

console.log("to serve and protect")
const mockd = new MockDaemon(8080)

mockd.expect.get("/favicon.ico").respond(404)
mockd.expect.get("/apple-touch-icon.png").respond(404)
mockd.expect.get("/apple-touch-icon-precomposed.png").respond(404)

mockd.expect.get("/").respondWithFile(200, "index.html", "text/html")
mockd.expect.get("/home").redirect(303, "/")
mockd.expect.get("/food").redirect(303, "/")
mockd.expect.get("/topics").redirect(303, "/")
mockd.expect.get("/about").redirect(303, "/")
mockd.expect.get("/style.css").respondWithFile(200, "style.css", "text/css")
mockd.expect.get("/js/main.js").respondWithFile(200, "js/main.js", "text/javascript")
mockd.expect.get("/js/main.js.map").respondWithFile(200, "js/main.js.map", "application/json")
fs.readdirSync("ttf").forEach(file => {
    mockd.expect.get(`/ttf/${file}`).respondWithFile(200, `ttf/${file}`, "text/ttf")
})

mockd.expect
    .get("/api/articles/4711")
    .delay(1000)
    .respond(200, { id: "4711", title: "Yoo", body: "Sup?" })

mockd.expect
    .get("/api/articles/")
    .delay(2000)
    .respond(200,
        [
            { id: "4711", title: "Tomato", body: "Soup" },
            { id: "1701", title: "Chicken", body: "Soup" },
            { id: "1541", title: "Noodle", body: "Soup" }
        ]
    )