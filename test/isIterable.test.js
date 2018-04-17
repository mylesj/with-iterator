const { isIterable } = require('..')

describe('isIterable', () => {
	describe('when there is no input', () => {
		test('should be false when undefined', () => {
			expect(isIterable(undefined)).toBe(false)
		})
		test('should be false when null', () => {
			expect(isIterable(null)).toBe(false)
		})
	})

	describe('when input is a composite type', () => {
		test('should be false for non-iterable objects', () => {
			expect(isIterable(Object())).toBe(false)
		})
		test('should be true for iterable objects', () => {
			expect(isIterable(Array())).toBe(true)
		})
	})

	describe('when the input is a primitive type', () => {
		test('should be false for non-iterable values', () => {
			expect(isIterable(1)).toBe(false)
		})
		test('should be true if the prototype has an iterator', () => {
			expect(isIterable('string-literal')).toBe(true)
		})
	})
})
