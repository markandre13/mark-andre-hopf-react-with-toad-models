import { NumberModel } from "../util"

export class Survey {
    percentage = new NumberModel(0.25)
    breakfast = new Servings()
    lunch = new Servings()
    dinner = new Servings()
    numberDaysOpenPerWeek = new NumberModel(5)
    weeksOpenPerYear = new NumberModel(51)

    get total(): number {
        return this.percentage.value
            * (this.breakfast.total + this.lunch.total + this.dinner.total)
            * this.numberDaysOpenPerWeek.value
            * this.weeksOpenPerYear.value
    }
}

class Servings {
    numberOfMeals = new NumberModel(10)
    averagePrice = new NumberModel(4.99)

    get total(): number {
        return this.numberOfMeals.value * this.averagePrice.value
    }
}
