import {
	isUndefined,
	isNull,
	isEmpty,
	isFunction,
	Undefined,
	Null
} from './types.js'

export const isIterable = thing => isFunction(Object(thing)[Symbol.iterator])

export const getIterator = thing => {
	let iterator = Object(thing)[Symbol.iterator]
	if (
		isUndefined(iterator) &&
		isFunction(thing) &&
		!isEmpty(thing.prototype)
	) {
		iterator = thing.prototype[Symbol.iterator]
	}
	return isFunction(iterator) ? iterator : undefined
}

export const boxed = thing =>
	isUndefined(thing)
		? new Undefined()
		: isNull(thing)
		? new Null()
		: Object(thing)

export const valueOf = thing => boxed(thing).valueOf()
