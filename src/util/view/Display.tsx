import { connected } from "node:process"
import React from "react"
import { Model } from "../model/Model"
// import { Input } from "../util/view/Input"

export interface DisplayState {
    value: string
}

export interface DisplayProps<T> {
    model: T
    code: () => string
}

export class Display<T extends Model> extends React.Component<DisplayProps<T>, DisplayState> {
    constructor(props: DisplayProps<T>) {
        super(props)
        this.state = {value:this.props.code()}
    }

    componentDidMount() {
        this.props.model.modified.add(() => {
            this.setState({value:this.props.code()})
        }, this)
    }

    componentWillUnmount() {
        this.props.model.modified.remove(this)
    }

    render(): React.ReactNode {
        return <React.Fragment>{this.state.value}</React.Fragment>
    }
}
