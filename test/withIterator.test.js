const { withIterator } = require('..')

describe('withIterator', () => {
	test('should maintain object references', () => {
		const item = { value: true }
		const iter = withIterator(() => {}, item)
		expect(iter).toBe(item)
	})

	test('should assign a non-enumerable property by default', () => {
		const iter = withIterator({ value: true })
		expect({ ...iter }).toEqual({ value: true })
	})

	describe('when iterator unspecified', () => {
		describe('applied to composite types', () => {
			test('should yield the same object', () => {
				const item = { value: true }
				const iter = withIterator(item)
				expect(Array.from(iter)[0]).toBe(item)
			})
			test('should delegate to existing iterators', () => {
				const item = Object.assign(
					{ value: true },
					{
						[Symbol.iterator]: function*() {
							yield { value: false }
						}
					}
				)
				const iter = withIterator(item)
				expect(Array.from(item)[0]).toEqual({ value: false })
			})
			test('should respect the prototype chain', () => {
				const proto = {
					[Symbol.iterator]: function*() {
						yield this.a
						yield this.b
						yield this.c
					}
				}
				const item = Object.create(proto, {
					a: { value: 1 },
					b: { value: 2 },
					c: { value: 3 }
				})
				const iter = withIterator(item)
				expect(Array.from(iter)).toEqual([1, 2, 3])
			})
		})

		describe('applied to primitive types', () => {
			describe('if no iterator exists on the prototype', () => {
				describe('should return an object of the same type', () =>
					[
						[1, Number],
						[true, Boolean],
						[Symbol.iterator, Symbol]
					].forEach(([item, Type]) =>
						test(Type.name, () =>
							expect(withIterator(item) instanceof Type).toBe(
								true
							)
						)
					))
			})
			describe('if an iterator exists on the prototype', () => {
				describe('should return the primitive value', () =>
					test('String', () =>
						expect(withIterator('str') instanceof String).toBe(
							false
						)))
			})
			describe('has an iterator returning scalar values', () =>
				[1, true, 'str', Symbol()].forEach(value =>
					test(Object(value).constructor.name, () => {
						const item = withIterator(value)
						expect(Array.from(item)).toEqual(
							value === 'str'
								? ['s', 't', 'r']
								: expect.arrayContaining([value])
						)
					})
				))
		})
	})

	describe('when iterator specified', () => {
		test('should not delegate to existing iterators', () => {
			const item = Object.assign([1, 2, 3], {
				[Symbol.iterator]: function*() {
					yield this
				}
			})
			const iter = withIterator(item)
			expect(Array.from(iter)[0]).toBe(item)
		})

		test('should curry if object unspecified', () => {
			const curried = withIterator(function*() {
				yield 'curry'
			})
			const item = curried({})
			expect(Array.from(item)[0]).toBe('curry')
		})
	})
})
