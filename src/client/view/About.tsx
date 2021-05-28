import React from "react"

import { observable, computed, action, makeObservable } from "mobx"
import { observer } from "mobx-react"

declare global {
  function prompt(message: string, defaultValue?: string): string
}

export class Survey {
  constructor() {
    makeObservable(this)
  }

  @observable percentage = 0.25
  breakfast = new Servings()
  lunch = new Servings()
  dinner = new Servings()
  @observable numberDaysOpenPerWeek = 5
  @observable weeksOpenPerYear = 51

  @action setWeeksOpenPerYear(a: number) {
    this.weeksOpenPerYear = a
  }

  @computed
  get total(): number {
    return this.percentage
      * (this.breakfast.total + this.lunch.total + this.dinner.total)
      * this.numberDaysOpenPerWeek
      * this.weeksOpenPerYear
  }
}

class Servings {
  constructor() {
    makeObservable(this)
  }
  @observable numberOfMeals = 10
  @observable averagePrice = 4.99

  @computed get total(): number {
    return this.numberOfMeals * this.averagePrice
  }
}

// interface InputProps {
//   label: string
//   model: string | number
// }

// @observer
// export class Input extends React.Component<InputProps> {
//   static idCounter = 0

//   id: string

//   constructor(props: InputProps) {
//     super(props)

//     this.id = `input-${++Input.idCounter}`

//     this.onChange = this.onChange.bind(this)
//   }

//   componentDidMount() {
//     this.props.model.modified.add(() => {
//       this.setState({ value: `${this.props.model.value}` })
//     }, this)
//   }

//   componentWillUnmount() {
//     this.props.model.modified.remove(this)
//   }

//   onChange(event: React.ChangeEvent<HTMLInputElement>): boolean {
//     if (this.props.model instanceof NumberModel) {
//       const value = Number.parseFloat(event.target.value)
//       if (!Number.isNaN(value))
//         this.props.model.value = value
//       this.setState({ value: event.target.value })
//     } else {
//       this.props.model.value = event.target.value
//     }
//     return true
//   }

//   render(): React.ReactNode {
//     return <div className="inputWithLabel">
//       <label htmlFor={this.id}>{this.props.label}</label>
//       <input id={this.id} value={this.state.value} onChange={this.onChange} />
//     </div>
//   }
// }

const survey = new Survey()

export const About: React.VFC = () => {
  return <About2 survey={survey} />
}

export const About2: React.VFC<{ survey: Survey }> = observer(({ survey }) => {
  return <>
    <h1>Potential Calculator</h1>
    Total Potential €{survey.total.toFixed(2)}

    <h2>Servings</h2>

    {[
      { title: "☕️ Breakfast", serving: survey.breakfast },
      { title: "🍱 Lunch", serving: survey.lunch },
      { title: "🍷 Dinner", serving: survey.dinner }].map(item =>
        <>
          <h3>{item.title}</h3>
          Daily Servings
          <input defaultValue={item.serving.numberOfMeals} />
          Average Price €
          <input defaultValue={item.serving.averagePrice} />
        </>
      )
    }

    <h2>Business Hours</h2>
    Days open per week
    <input defaultValue={survey.numberDaysOpenPerWeek} />
    Weeks open per year
    <input defaultValue={survey.weeksOpenPerYear} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value)
      if (!Number.isNaN(value)) {
        survey.setWeeksOpenPerYear(value) // this is needed in strict mode
        // survey.weeksOpenPerYear = value // this is okay when not in strict mode
        console.log(`call setWeekOpenPerYear()`)
      }
      console.log(`updated value to ${value}`)
    }} />
  </>
})
