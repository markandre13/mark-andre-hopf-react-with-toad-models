import React from "react"
import { Input } from "../util/view/Input"
import { Display } from "../util/view/Display"
import { Survey } from "../model/Survey"

export const Food: React.VFC<{survey: Survey}> = ({survey}) => {
  return <React.Fragment>
    <h1>Potential Calculator</h1>
    Total Potential €<Display model={survey} code={()=>survey.total.toFixed(2)}/>

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
