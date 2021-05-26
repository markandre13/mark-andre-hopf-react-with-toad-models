import { expect } from "chai"
import { Signal, NumberModel, attachSignalToModels, detachSignalFromModels } from "../src/client/util"

export class Survey {
    percentage = new NumberModel(0.25)
    breakfast = new Servings()
    lunch = new Servings()
    dinner = new Servings()
    numberDaysOpenPerWeek = new NumberModel(5)
    weeksOpenPerYear = new NumberModel(51)

    get total(): number {
        return this.percentage.value * (this.breakfast.total + this.lunch.total + this.dinner.total)
            * this.numberDaysOpenPerWeek.value * this.weeksOpenPerYear.value
    }
}

class Servings {
    numberOfMeals = new NumberModel(10)
    averagePrice = new NumberModel(4.99)

    get total(): number {
        return this.numberOfMeals.value * this.averagePrice.value
    }
}

describe("utils", () => {
    it("attachSignalToModels() and detachSignalFromModels()", () => {
        const survey = new Survey()
        const signal = new Signal()
        let counter = 0
        signal.add( () => {
            ++counter
        })
        attachSignalToModels(signal, survey)
        expect(counter).equals(0)

        survey.numberDaysOpenPerWeek.value = 2
        expect(counter).equals(1)

        survey.dinner.averagePrice.value = 3.99
        expect(counter).equals(2)

        detachSignalFromModels(signal, survey)
        expect(counter).equals(2)

        survey.numberDaysOpenPerWeek.value = 3
        expect(counter).equals(2)

        survey.dinner.averagePrice.value = 2.99
        expect(counter).equals(2)
    })
})

// asynchronous vs threads? here are some numbers https://github.com/jimblandy/context-switch

// https://github.com/facebook/flux/tree/master/examples/flux-todomvc/
// https://todomvc.com

// note to self: apollo client & graphql for bff (backend for frontend, a api gateway pattern)
// https://github.com/apollographql/apollo-client

// https://itnext.io/under-the-hood-of-react-hooks-805dc68581c3

// const [reducerState, actionDispatcher] = useState(x)
