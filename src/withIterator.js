import { isUndefined, isFunction, isIterable } from './util'

const assignIterator = (iterator, thing, descriptor) => {
	const isIterator = isFunction(iterator)
	if (isIterable(thing) && !isIterator) return thing
	return Object.defineProperty(Object(thing), Symbol.iterator, {
		writable: true,
		configurable: true,
		enumerable: false,
		...descriptor,
		value: isIterator
			? iterator
			: function* singleton() {
					yield this.valueOf()
			  }
	})
}

export const withIterator = (maybeIterator, ...args) =>
	isFunction(maybeIterator)
		? (args.length && assignIterator(maybeIterator, ...args)) ||
		  ((...args) => assignIterator(maybeIterator, ...args))
		: !isUndefined(maybeIterator)
			? assignIterator(undefined, maybeIterator, ...args)
			: withIterator
