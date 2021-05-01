import React from "react"
import { Input } from "./Input"

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
    <Input label="Weeks open per year" name="numberWeeksOpenInYear" />

  </React.Fragment>
}

