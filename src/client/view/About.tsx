import React from "react"

import { observable, computed } from "mobx"
import { observer } from "mobx-react"

export class Survey {
  @observable percentage = 0.25
  breakfast = new Servings()
  lunch = new Servings()
  dinner = new Servings()
  @observable numberDaysOpenPerWeek = 5
  @observable weeksOpenPerYear = 51

  get total(): number {
      return this.percentage
          * (this.breakfast.total + this.lunch.total + this.dinner.total)
          * this.numberDaysOpenPerWeek
          * this.weeksOpenPerYear
  }
}

class Servings {
  @observable numberOfMeals = 10
  @observable averagePrice = 4.99

  @computed get total(): number {
      return this.numberOfMeals * this.averagePrice
  }
}

interface InputProps {
  label: string
  model: string | number
}

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

export const About2: React.VFC<{survey: Survey}> = ({survey}) => {
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
          <input value={item.serving.numberOfMeals} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number.parseFloat(event.target.value)
            if (!Number.isNaN(value)) {
              item.serving.numberOfMeals = value
            }
            console.log(`updated value to ${value}`)
          }} />
          Average Price €
          <input value={item.serving.averagePrice} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number.parseFloat(event.target.value)
            if (!Number.isNaN(value)) {
              item.serving.numberOfMeals = value
            }
            console.log(`updated value to ${value}`)
          }} />
        </>
      )
    }

    <h2>Business Hours</h2>
    Days open per week
    <input value={survey.numberDaysOpenPerWeek} />
    Weeks open per year
    <input value={survey.weeksOpenPerYear}/>
  </>
}
