export const isFunction = (thing) => typeof thing === 'function'

export const isUndefined = (thing) => thing === undefined

export const isNull = (thing) => thing === null

export const isEmpty = (thing) => isUndefined(thing) || isNull(thing)

export class Empty {
    constructor() {
        Object.defineProperty(this, Symbol.iterator, {
            writable: true,
            enumerable: false,
            value: undefined,
        })
        Object.seal(this)
    }
    toString() {
        return String(this.valueOf())
    }
}

export class Undefined extends Empty {
    valueOf() {
        return undefined
    }
}

export class Null extends Empty {
    valueOf() {
        return null
    }
}
