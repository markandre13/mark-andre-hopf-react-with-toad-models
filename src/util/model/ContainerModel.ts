import { Model } from "./Model"

// this one's experimental
export class ContainerModel extends Model {
    // we could also examine the model and automatically add outselves
    // will the garbage collection be able to delete this?
    observe<T extends Model>(model: T): T {
        model.modified.add(() => this.modified.trigger())
        return model
    }
}
