import React from "react"
import { TextModel } from "../model/TextModel"
import { NumberModel } from "../model/NumberModel"

interface InputState {
  value: string
}

interface InputProps {
  label: string
  model: TextModel | NumberModel
}

export class Input extends React.Component<InputProps, InputState> {
  static idCounter = 0

  id: string

  constructor(props: InputProps) {
    super(props)
    this.state = { value: `${props.model.value}` }
    this.id = `input-${++Input.idCounter}`

    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    this.props.model.modified.add(() => {
      this.setState({ value: `${this.props.model.value}` })
    }, this)
  }

  componentWillUnmount() {
    this.props.model.modified.remove(this)
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>): boolean {
    if (this.props.model instanceof NumberModel) {
      const value = Number.parseFloat(event.target.value)
      if (!Number.isNaN(value))
        this.props.model.value = value
      this.setState({ value: event.target.value })
    } else {
      this.props.model.value = event.target.value
    }
    return true
  }

  render(): React.ReactNode {
    return <div className="inputWithLabel">
      <label htmlFor={this.id}>{`${this.props.label} "${this.state.value}"`}</label>
      <input id={this.id} value={this.state.value} onChange={this.onChange} />
    </div>
  }
}
