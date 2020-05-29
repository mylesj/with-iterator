// verify deno import works with bundled dist

import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts'

import { withIterator, isIterable, getIterator, valueOf } from '../deno.js'

Deno.test('DIST: all imports have extensions', () => {
	// listed in case of "unused import" linting
	// and / or unintended dead-code elimination
	withIterator
	isIterable
	getIterator
	valueOf

	assert(true)
})

Deno.test('DIST: basic input / output', () => {
	const it = function*() {
		yield* [1, 2, 3]
	}
	const expected = [1, 2, 3]
	const actual = Array.from(withIterator(it, null))
	assertEquals(actual, expected)
})
