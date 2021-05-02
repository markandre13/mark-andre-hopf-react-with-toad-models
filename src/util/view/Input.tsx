import React from "react"
import { TextModel } from "../model/TextModel"
import { NumberModel } from "../model/NumberModel"

interface InputXState {
  value: string
}

interface InputXProps {
  label: string
  model: TextModel|NumberModel
}

export class Input extends React.Component<InputXProps, InputXState> {
  static idCounter = 0

  id: string

  constructor(props: InputXProps) {
    super(props)
    this.state = {value: `${props.model.value}` }
    this.id = `input-${++Input.idCounter}`
  }

  componentDidMount() {
    this.props.model.modified.add( () => {
      this.setState({value: `${this.props.model.value}` })
    }, this)
  }

  componentWillUnmount() {
    this.props.model.modified.remove(this)
  }

  render(): React.ReactNode {
    return <div className="inputWithLabel">
    <label htmlFor={this.id}>{`${this.props.label} "${this.state.value}"`}</label>
    <input id={this.id} value={this.state.value} onChange={
      (event) => {
        if (this.props.model instanceof NumberModel) {
          const value = Number.parseFloat(event.target.value)
          if (!Number.isNaN(value))
            this.props.model.value = value
          this.setState({value: event.target.value })
        } else {
          this.props.model.value = event.target.value
        }
      }}/>
  </div>
  }
}
