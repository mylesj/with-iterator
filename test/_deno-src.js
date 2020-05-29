// verify deno import works with direct source files

import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts'

import { withIterator, isIterable, getIterator, valueOf } from '../src/index.js'

Deno.test('SRC: all imports have extensions', () => {
	// listed in case of "unused import" linting
	// and / or unintended dead-code elimination
	withIterator
	isIterable
	getIterator
	valueOf

	assert(true)
})

Deno.test('SRC: basic input / output', () => {
	const it = function*() {
		yield* [1, 2, 3]
	}
	const expected = [1, 2, 3]
	const actual = Array.from(withIterator(it, null))
	assertEquals(actual, expected)
})
