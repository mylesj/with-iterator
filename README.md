[![npm version][img:npm-version]][repo:package]
[![build status][img:repo-status]][repo:status]
[![coverage status][img:coveralls]][ext:coveralls]
[![conventional commits][img:commits]][ext:commits]

# with-iterator

A simple ECMA2015 helper function for attaching iterator factories or
generators to arbitrary input, be it an object or primitive type.
Key points:

-   Is mutative - if passed a composite type, returns the same reference.
-   Is type aware - if passed a primitive, returns the same object type.
-   Is curried - if passed only a function, composes a new wrapper.

## exposes

-   **withIterator**  
    => ( factory: _function_, input: _any_ [, descriptor: _object_ ] ): _object_
-   **withIterator**  
    => ( factory: _function_ ): _function_ => ( input: _any_ [, descriptor: _object_ ] ): _object_
-   **isIterable**  
    => ( input: _any_ ): _boolean_
-   **getIterator**  
    => ( input: _any_ ): _function_
-   **valueOf**  
    => ( input: _any_ ): input

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

### usage

```js
const {
	withIterator,
	isIterable,
	getIterator,
	valueOf
} = require('with-iterator')
```

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

Can work with prototypes.

```js
class Digits extends Number {}
withIterator(function*() {
	for (let d of getIterator(String).call(this)) yield Number(d)
}, Digits.prototype)

const digits = new Digits(54321)
Array.from(digits) // [5, 4, 3, 2, 1]
```

Resolve boxed primitives.

```js
const nul = withIterator(null)
const und = withIterator(undefined)
const num = withIterator(42)
console.log(
	valueOf(nul), // null
	valueOf(und), // undefined
	valueOf(num) // 42
)
```

[repo:status]: https://travis-ci.org/mylesj/with-iterator
[repo:package]: https://www.npmjs.com/package/with-iterator
[repo:examples]: https://runkit.com/mylesj/with-iterator/1.2.0
[ext:defineproperty]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
[ext:commits]: https://conventionalcommits.org
[ext:coveralls]: https://coveralls.io/github/mylesj/with-iterator?branch=master
[img:repo-status]: https://travis-ci.org/mylesj/with-iterator.svg?branch=master
[img:npm-version]: https://badgen.net/npm/v/with-iterator
[img:commits]: https://badgen.net/badge/conventional%20commits/1.0.0/yellow
[img:coveralls]: https://coveralls.io/repos/github/mylesj/with-iterator/badge.svg?branch=master
