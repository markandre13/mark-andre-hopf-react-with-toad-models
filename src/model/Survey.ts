import { NumberModel } from "../util/model/NumberModel"
import { ContainerModel } from "../util/model/ContainerModel"

// TODO: this should read as tight as JSON
// TODO: maybe generate the typescript * Java DTO from a shared definition
export class Survey extends ContainerModel {
    percentage = new NumberModel(0.25)
    breakfast = this.observe(new Servings())
    lunch = this.observe(new Servings())
    dinner = this.observe(new Servings())
    numberDaysOpenPerWeek = this.observe(new NumberModel(5))
    weeksOpenPerYear = this.observe(new NumberModel(51))

    get total(): number {
        return this.percentage.value * ( this.breakfast.total + this.lunch.total + this.dinner.total )
        * this.numberDaysOpenPerWeek.value * this.weeksOpenPerYear.value
    }
}

class Servings extends ContainerModel {
    numberOfMeals = this.observe(new NumberModel(10))
    averagePrice = this.observe(new NumberModel(4.99))
    
    get total(): number {
        return this.numberOfMeals.value * this.averagePrice.value
    }
}
