[![npm version][img:npm-version]][repo:package]
[![node engine][img:node-version]][ext:node]
[![build status][img:repo-status]][repo:status]
[![styled with prettier][img:prettier]][ext:prettier]

# with-iterator

A simple ECMA2015 helper function for attaching iterator factories or
generators to arbitrary input, be it an object or primitive type.
Key points:

*   Is mutative - if passed a composite type, returns the same reference.
*   Is type aware - if passed a primitive, returns the same object type.
*   Is curried - if passed only a function, composes a new wrapper.

## exposes

*   **isIterable**
    => ( input: _any_ ): _boolean_
*   **withIterator**
    => ( factory: _function_, input: _any_ [, descriptor: _Object_ ] ): _Object_
*   **withIterator**
    => ( factory: _function_ ): _function_
    => ( input: _any_ [, descriptor: _Object_ ] ): _Object_

The `descriptor` parameter is optional and corresponds to that of
[`Object.defineProperty`][ext:defineproperty] - unless overridden, is
set with sensible defaults:

```js
{
    writable: true,
    configurable: true,
    enumerable: false
}
```

## examples

» [RunKit][repo:examples]

> Usage: `const { withIterator } = require('with-iterator')`

By default if not passed a factory (function), any input is assigned
an iterator that yields itself, if it isn't already iterable - else
it is unchanged.

```js
Array.from(withIterator([1, 2, 3])) // [ 1, 2, 3 ]
Array.from(withIterator({ value: true })) // [ { value: true } ]
```

When explicitly passed a factory, any existing one is superseded.

```js
const sum = function* allThatCameBefore() {
	let i = 0
	let n = 0
	while (i < this.length) {
		yield (n += this[i])
		i++
	}
}
const foo = withIterator(sum, [1, 2, 3, 4, 5])
Array.from(foo) // [ 1, 3, 6, 10, 15 ]
```

Can compose new helpers and works with primitives.

```js
const hex = ['123456', 'cc9933', 'fedcba']
const rgb = withIterator(function*() {
	const re = /../g
	let next
	while ((next = re.exec(this))) yield Number.parseInt(next, 16)
})
hex.map(rgb).forEach(code => {
	console.log(`hex: ${code} - rgb: (${[...code]})`)
})
// hex: 123456 - rgb: (18,52,86)
// hex: cc9933 - rgb: (204,153,51)
// hex: fedcba - rgb: (254,220,186)
```

[repo:status]: https://travis-ci.org/mylesj/with-iterator
[repo:package]: https://www.npmjs.com/package/with-iterator
[repo:examples]: https://runkit.com/mylesj/with-iterator/1.0.2
[ext:defineproperty]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
[ext:prettier]: https://github.com/prettier/prettier
[ext:node]: https://nodejs.org/en/
[img:repo-status]: https://travis-ci.org/mylesj/with-iterator.svg?branch=master
[img:npm-version]: https://badge.fury.io/js/with-iterator.svg
[img:node-version]: https://img.shields.io/node/v/with-iterator.svg
[img:prettier]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
