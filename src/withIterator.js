import { isUndefined, isFunction, isIterable, boxed, valueOf } from './util'

const assignIterator = (iterator, thing, descriptor) => {
	const isIterator = isFunction(iterator)
	if (isIterable(thing) && !isIterator) return thing
	return Object.defineProperty(boxed(thing), Symbol.iterator, {
		writable: true,
		configurable: true,
		enumerable: false,
		...descriptor,
		value: isIterator
			? iterator
			: function* singleton() {
					yield valueOf(this)
			  }
	})
}

export const withIterator = (...args) => {
	const [maybeIterator] = args
	if (args.length === 1)
		return isFunction(maybeIterator)
			? (...a) => assignIterator(maybeIterator, ...a)
			: assignIterator(undefined, ...args)
	return assignIterator(...args)
}
