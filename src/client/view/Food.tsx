import React from "react"
import { Input, Display } from "../util"
import { Survey } from "../model/Survey"

export const Food: React.VFC<{survey: Survey}> = ({survey}) => {
  return <>
    <h1>Potential Calculator with toad.js Models</h1>
    Total Potential €<Display model={survey} code={()=>survey.total.toFixed(2)}/>

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
    <Input label="Weeks open per year" model={survey.weeksOpenPerYear}/>
  </>
}
