export { Signal } from "./util/Signal"
export { Model } from "./util/model/Model"
export { GenericModel } from "./util/model/GenericModel"
export { TextModel } from "./util/model/TextModel"
export { NumberModel } from "./util/model/NumberModel"

export { Input } from "./util/view/Input"
export { Display } from "./util/view/Display"

import { Signal } from "./util/Signal"
import { Model } from "./util/model/Model"

export function attachSignalToModels(signal: Signal, model: Object) {
    for (const [key, value] of Object.entries(model)) {
        if (typeof value !== 'object')
            continue
        if (value instanceof Model) {
            value.modified.add(() => {
                signal.trigger()
            }, signal)
        }
        attachSignalToModels(signal, value)
    }
}

export function detachSignalFromModels(signal: Signal, model: Object) {
    for (const [key, value] of Object.entries(model)) {
        if (typeof value !== 'object')
            continue
        if (value instanceof Model)
            value.modified.remove(signal)
        detachSignalFromModels(signal, value)
    }
}
