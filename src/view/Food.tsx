import React from "react"
import { Input } from "./Input"
import { NumberModel } from "./NumberModel"

export const Food: React.VFC = () => {
  return <React.Fragment>
    <h1>Potential Calculator</h1>
    Total Potential €{survey.getTotal()}

    <h2>Servings</h2>

    {[
      { title: "☕️ Breakfast", name: survey.breakfast },
      { title: "🍱 Lunch", name: survey.lunch },
      { title: "🍷 Dinner", name: survey.dinner }].map(item =>
        <React.Fragment>
          <h3>{item.title}</h3>
          <Input label="Daily Servings" model={item.name.numberOfMeals} />
          <Input label="Average Price €" model={item.name.averagePrice} />
        </React.Fragment>
      )
    }

    <h2>Business Hours</h2>
    <Input label="Days open per week" model={survey.numberDaysOpenPerWeek} />
    <Input label="Weeks open per year" model={survey.weeksOpenPerYear}/>

  </React.Fragment>
}

class Servings {
  numberOfMeals = new NumberModel(10)
  averagePrice = new NumberModel(4.99)
}

class Survey {
  breakfast = new Servings()
  lunch = new Servings()
  dinner = new Servings()
  numberDaysOpenPerWeek = new NumberModel(5)
  weeksOpenPerYear = new NumberModel(51)
  getTotal(): number {
    return this.numberDaysOpenPerWeek.value * this.weeksOpenPerYear.value
  }
}

const survey = new Survey()



