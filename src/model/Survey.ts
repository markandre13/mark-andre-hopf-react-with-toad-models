import { Model } from "../util/model/Model"
import { NumberModel } from "../util/model/NumberModel"

// this one's experimental
class ContainerModel extends Model {
    // we could also examine the model and automatically add outselves
    // will the garbage collection be able to delete this?
    observe<T extends Model>(model: T): T {
        model.modified.add( () => this.modified.trigger() )
        return model
    }
}

export class Survey extends ContainerModel {
    breakfast = this.observe(new Servings())
    lunch = this.observe(new Servings())
    dinner = this.observe(new Servings())
    numberDaysOpenPerWeek = this.observe(new NumberModel(5))
    weeksOpenPerYear = this.observe(new NumberModel(51))
    get total(): number {
        return ( this.breakfast.total + this.lunch.total + this.dinner.total )
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
