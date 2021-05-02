import { Signal } from "./Signal"
import { Model } from "./model/Model"

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
