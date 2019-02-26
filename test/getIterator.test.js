import { getIterator } from '../src/util'
import { withIterator } from '../src/with-iterator'

describe('getIterator', () => {
	describe('when passed an object with an iterator', () => {
		test('should return undefined if the value is not a function', () => {
			const obj = { [Symbol.iterator]: true }
			expect(getIterator(obj)).toBe(undefined)
		})

		test('should return a function if it exists', () => {
			const obj = withIterator({})
			expect(typeof getIterator(obj)).toBe('function')
		})
	})

	describe('when passed a function', () => {
		test('should return iterators on a constructable prototype', () => {
			class Test {}
			const iterator = function*() {}
			withIterator(iterator, Test.prototype)
			expect(getIterator(Test)).toBe(iterator)
		})

		test('should prioritise own properties even if erroneous', () => {
			class Test {}
			withIterator(Test.prototype)
			Test[Symbol.iterator] = true
			expect(getIterator(Test)).toBe(undefined)
		})

		test('should not be perturbed by non-constructables', () => {
			expect(getIterator(() => {})).toBe(undefined)
		})
	})

	describe('when passed an iterable', () => {
		test('should return a working iterator', () => {
			const defaultIterator = getIterator(withIterator(undefined))
			const str = withIterator(defaultIterator, 'string')
			expect(Array.from(str)[0]).toBe('string')
		})

		test('should work with primitives', () => {
			const iterator = getIterator('string')
			const num = withIterator(iterator, 42)
			expect(Array.from(num)).toEqual(['4', '2'])
		})

		test('should work with native prototypes', () => {
			const iterator = getIterator(String)
			const num = withIterator(iterator, 42)
			expect(Array.from(num)).toEqual(['4', '2'])
		})
	})
})
