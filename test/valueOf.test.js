const { valueOf, withIterator } = require('..')

describe('valueOf', () => {
	test('should pass-through object refereces', () => {
		const ref = {}
		expect(valueOf(ref)).toBe(ref)
	})
	describe('should return primitive types as-is', () => {
		const toTest = [
			['null', null],
			['undefined', undefined],
			['string', 'str'],
			['number', 42],
			['boolean', true],
			['symbol', Symbol('sym')]
		]
		toTest.forEach(([name, input]) =>
			test(name, () => expect(valueOf(input)).toBe(input))
		)
	})
	describe('should return boxed primitives as primitives', () => {
		const toTest = [
			['null', null],
			['undefined', undefined],
			['string', 'str'],
			['number', 42],
			['boolean', true],
			['symbol', Symbol('sym')]
		]
		toTest.forEach(([name, input]) =>
			test(name, () => expect(valueOf(withIterator(input))).toBe(input))
		)
	})
})
