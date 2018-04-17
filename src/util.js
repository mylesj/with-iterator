export const isFunction = thing => typeof thing === 'function'

export const isUndefined = thing => typeof thing === 'undefined'

export const isIterable = thing => isFunction(Object(thing)[Symbol.iterator])
