import { boxed } from '../src/utils'

describe('boxed', () => {
	test('should pass-through object references', () => {
		const ref = {}
		expect(boxed(ref)).toBe(ref)
	})

	describe('should return boxed primitives that can resolve initial input', () => {
		const toTest = [
			['null', null],
			['undefined', undefined],
			['string', 'str'],
			['number', 42],
			['boolean', true],
			['symbol', Symbol('sym')]
		]
		toTest.forEach(([name, input]) =>
			test(name, () => {
				const boxedInput = boxed(input)
				expect(typeof boxedInput).toBe('object')
				expect(boxedInput.valueOf()).toBe(input)
			})
		)
	})
})
