[![npm version][img:npm-version]][repo:package]
[![build status][img:repo-status]][repo:status]
[![coverage status][img:coveralls]][ext:coveralls]

# with-iterator

A utility for attaching iterator factories / generators to arbitrary input.

-   Is mutative - when passed a composite type, returns the same reference.
-   Is type aware - when passed a primitive, returns the same object type.
-   Is curried - when passed a single function, composes a new wrapper.

**TL;DR** [examples](#examples)

## motivation

The project originally served as a simple aid in understanding the mechanics of
publishing to NPM while also an excuse to play around with generator functions,
which I generally don't find many use-cases for in day-to-day app. development.
For the same reason this package has limited application but I still like
tinkering with generators on the REPL for which it has some utility.

More recently I've been learning some of the more advanced TypeScript concepts
and tried to apply them retrospectively here. They're passable but could probably
be better - I'm not sure how to reconcile mutative behaviour for example.

## install

### Node

```none
> npm install with-iterator
```

```js
const { withIterator } = require('with-iterator')
```

### Deno

```typescript
// "https://unpkg.com/with-iterator@VERSION/deno.js" VERSION >= 2.0.0
import { withIterator } from 'https://unpkg.com/with-iterator/deno.js'
```

### TypeScript

Depending on existing environment or project setup the following minimal
config may also be required.

```json
{
	"compilerOptions": {
		// optional - will improve type resolution if enabled
		"strictNullChecks": true,
		"lib": ["es5", "es2015.iterable", "es2015.generator"]
	}
}
```

## exposes

> **_Note:_** _The documented types here are simplified for readability.
> Inner types should be preserved - see [source][repo:types] for detail._

### withIterator

```typescript
function withIterator(
	factory: () => Generator,
	input: any,
	descriptor?: PropertyDescriptor
): Iterable
```

```typescript
function withIterator(
	factory: () => Generator
): (input: any, descriptor?: PropertyDescriptor) => Iterable
```

```typescript
function withIterator(input: any): Iterable
```

The optional `descriptor` parameter corresponds to that of
[`Object.defineProperty`][ext:defineproperty] and if not overridden, is
set with sensible defaults:

```js
{
    writable: true,
    configurable: true,
    enumerable: false
}
```

### isIterable

```typescript
function isIterable(input: any): boolean
```

### getIterator

```typescript
function getIterator(input: any): unknown | () => Generator
```

### valueOf

```typescript
function valueOf(input: any): any
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

By default if not passed a factory function, any input is assigned
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

When only passed a factory, will compose a new helper. This
examples also demonstrates the use of primitive input.

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

Setting an iterator on a class prototype.

```js
class Digits extends Number {}
withIterator(function*() {
	for (let d of getIterator(String).call(this)) yield Number(d)
}, Digits.prototype)

const digits = new Digits(54321)
Array.from(digits) // [5, 4, 3, 2, 1]
```

Resolving boxed primitives.

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
[repo:examples]: https://runkit.com/mylesj/with-iterator/2.0.0
[repo:types]: https://github.com/mylesj/with-iterator/blob/master/types.d.ts
[ext:defineproperty]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
[ext:coveralls]: https://coveralls.io/github/mylesj/with-iterator?branch=master
[img:repo-status]: https://travis-ci.org/mylesj/with-iterator.svg?branch=master
[img:npm-version]: https://badgen.net/npm/v/with-iterator
[img:coveralls]: https://coveralls.io/repos/github/mylesj/with-iterator/badge.svg?branch=master
