import React from "react"
import { Input } from "./Input"
import { GenericModel } from "../GenericModel"

export const Food: React.VFC = () => {
  return <React.Fragment>
    <h1>Potential Calculator</h1>
    Total Potential

    <h2>Servings</h2>

    {[
      { title: "☕️ Breakfast", name: "breakfast" },
      { title: "🍱 Lunch", name: "lunch" },
      { title: "🍷 Dinner", name: "dinner" }].map(item =>
        <React.Fragment>
          <h3>{item.title}</h3>
          <Input label="Daily Servings" name={`${item.name}.numberOfMeals`} />
          <Input label="Average Price €" name={`${item.name}.averagePrice`} />
        </React.Fragment>
      )
    }

    <h2>Business Hours</h2>
    <Input label="Days open per week" name="numberDaysOpenPerWeek" />
    <InputX label="Weeks open per year" model={weeksOpenPerYear}/>

  </React.Fragment>
}

export class TextModel extends GenericModel<string> {
}

export class NumberModel extends GenericModel<number> {
}

const weeksOpenPerYear = new NumberModel(4711)

interface InputXState {
  value: string
}

interface InputXProps {
  label: string
  model: TextModel|NumberModel
}

class InputX extends React.Component<InputXProps, InputXState> {
  static idCounter = 0

  id: string

  constructor(props: InputXProps) {
    super(props)
    this.state = {value: `${props.model.value}` }
    this.id = `input-${++InputX.idCounter}`
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
