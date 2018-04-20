export const isFunction = thing => typeof thing === 'function'

export const isUndefined = thing => thing === undefined

export const isNull = thing => thing === null

export const isEmpty = thing => isUndefined(thing) || isNull(thing)

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

export class Undefined {
	valueOf() {
		return undefined
	}
}

export class Null {
	valueOf() {
		return null
	}
}

export const boxed = thing =>
	isUndefined(thing)
		? new Undefined()
		: isNull(thing)
			? new Null()
			: Object(thing)

export const valueOf = thing => boxed(thing).valueOf()
