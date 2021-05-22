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

export function detachSignalFromModels(signal: Signal, model: Object, depth = 0, track = new Set<Object>()) {
    if (model === null || model === undefined || typeof model !== 'object') {
        return
    }
    if (model instanceof Signal) {
        return
    }
    if (track.has(model)) {
        return
    }

    // console.log(`detachSignalFromModels(): signal=${signal}, model=${model} ${typeof model}, depth=${depth}`)

    if (model instanceof Model) {
        model.modified.remove(signal)
    }

    track.add(model)
    for (const [key, value] of Object.entries(model)) {
        detachSignalFromModels(signal, (model as any)[key], depth+1, track)
    }
    track.delete(model)
}
