import React from "react"
import { Signal, attachSignalToModels, detachSignalFromModels } from "../../util"

export interface DisplayState {
    value: string
}

export interface DisplayProps<T> {
    model: T
    code: () => string
}

export class Display<T> extends React.Component<DisplayProps<T>, DisplayState> {
    private signal = new Signal()

    constructor(props: DisplayProps<T>) {
        super(props)
        this.state = {value:this.props.code()}
    }

    componentDidMount() {
        attachSignalToModels(this.signal, this.props.model)
        this.signal.add(() => {
            this.setState({value:this.props.code()})
        }, this)
    }

    componentWillUnmount() {
        this.signal.remove(this)
        detachSignalFromModels(this.signal, this.props.model)
    }

    render(): React.ReactNode {
        return <React.Fragment>{this.state.value}</React.Fragment>
    }
}
