import { NumberModel } from "../util/model/NumberModel"

class Servings {
    numberOfMeals = new NumberModel(10)
    averagePrice = new NumberModel(4.99)
}

export class Survey {
    breakfast = new Servings()
    lunch = new Servings()
    dinner = new Servings()
    numberDaysOpenPerWeek = new NumberModel(5)
    weeksOpenPerYear = new NumberModel(51)
    getTotal(): number {
        return this.numberDaysOpenPerWeek.value * this.weeksOpenPerYear.value
    }
}
