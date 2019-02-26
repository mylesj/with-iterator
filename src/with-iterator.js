import { isIterable, boxed } from './utils'
import { isUndefined, isFunction, Empty } from './types'

const assignIterator = (iterator, thing, descriptor) => {
	const isIterator = isFunction(iterator)
	if (isIterable(thing) && !isIterator) return thing
	const iterator_ = isIterator
		? iterator
		: function* singleton() {
				yield this.valueOf()
		  }
	const boxed_ = boxed(thing)
	if (boxed_ instanceof Empty) {
		boxed_[Symbol.iterator] = iterator_
		return boxed_
	}
	return Object.defineProperty(boxed_, Symbol.iterator, {
		writable: true,
		configurable: true,
		enumerable: false,
		...descriptor,
		value: iterator_
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
