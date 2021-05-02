import { Model } from "../util/model/Model"
import { NumberModel } from "../util/model/NumberModel"

class ContainerModel extends Model {
    observe<T extends Model>(model: T): T {
        model.modified.add( () => this.modified.trigger() )
        return model
    }
}

class Servings extends ContainerModel {
    numberOfMeals = this.observe(new NumberModel(10))
    averagePrice = this.observe(new NumberModel(4.99))
}

export class Survey extends ContainerModel {
    breakfast = this.observe(new Servings())
    lunch = this.observe(new Servings())
    dinner = this.observe(new Servings())
    numberDaysOpenPerWeek = this.observe(new NumberModel(5))
    weeksOpenPerYear = this.observe(new NumberModel(51))
    getTotal(): number {
        return this.numberDaysOpenPerWeek.value * this.weeksOpenPerYear.value
    }
}
