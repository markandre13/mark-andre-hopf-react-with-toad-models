import React from "react"

import { observable, computed, action, makeObservable } from "mobx"
import { observer } from "mobx-react"

declare global {
  function prompt(message: string, defaultValue?: string): string
}

class Model<T> {
  constructor(value: T) {
    this.value = value
    makeObservable(this)
  }
  @observable value: T
  @action setValue(value: T) {
    this.value = value
  }
}

class NumberModel extends Model<number> {}

export class Survey {
  constructor() {
    makeObservable(this)
  }

  percentage = new NumberModel(0.25)
  breakfast = new Servings()
  lunch = new Servings()
  dinner = new Servings()
  numberDaysOpenPerWeek = new NumberModel(5)
  weeksOpenPerYear = new NumberModel(51)

  @computed
  get total(): number {
    return this.percentage.value
      * (this.breakfast.total + this.lunch.total + this.dinner.total)
      * this.numberDaysOpenPerWeek.value
      * this.weeksOpenPerYear.value
  }
}

class Servings {
  constructor() {
    makeObservable(this)
  }
  numberOfMeals = new NumberModel(10)
  averagePrice = new NumberModel(4.99)

  @computed get total(): number {
    return this.numberOfMeals.value * this.averagePrice.value
  }
}

interface InputProps {
  label: string
  model: NumberModel
}

export class Input extends React.Component<InputProps> {
  static idCounter = 0

  id: string

  constructor(props: InputProps) {
    super(props)
    this.id = `input-${++Input.idCounter}`
    this.onChange = this.onChange.bind(this)
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>): boolean {
    if (this.props.model instanceof NumberModel) {
      const value = Number.parseFloat(event.target.value)
      if (!Number.isNaN(value))
        this.props.model.setValue(value)
      this.setState({ value: event.target.value })
    }
    return true
  }

  render(): React.ReactNode {
    return <div className="inputWithLabel">
      <label htmlFor={this.id}>{this.props.label}</label>
      <input id={this.id} defaultValue={this.props.model.value} onChange={this.onChange} />
    </div>
  }
}

const survey = new Survey()

export const About: React.VFC = () => {
  return <About2 survey={survey} />
}

export const About2: React.VFC<{ survey: Survey }> = observer(({ survey }) => {
  return <>
    <h1>Potential Calculator with MobX</h1>
    Total Potential €{survey.total.toFixed(2)}

    <h2>Servings</h2>

    {[
      { title: "☕️ Breakfast", serving: survey.breakfast },
      { title: "🍱 Lunch", serving: survey.lunch },
      { title: "🍷 Dinner", serving: survey.dinner }].map(item =>
        <>
          <h3>{item.title}</h3>
          <Input label="Daily Servings" model={item.serving.numberOfMeals} />
          <Input label="Average Price €" model={item.serving.averagePrice} />
        </>
      )
    }

    <h2>Business Hours</h2>
    <Input label="Days open per week" model={survey.numberDaysOpenPerWeek} />
    <Input label="Weeks open per year" model={survey.weeksOpenPerYear} />
  </>
})
