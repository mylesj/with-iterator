[![github][img:github]][repo:github]
[![npm version][img:npm-version]][repo:package]
[![coverage status][img:coveralls]][ext:coveralls]

# with-iterator

A utility for attaching iterator factories / generators to arbitrary input.

-   Is mutative - when passed a composite type, returns the same reference.
-   Is type aware - when passed a primitive, returns the same object type.
-   Is curried - when passed a single function, composes a new wrapper.

**TL;DR** [examples](#examples)

## motivation

This project originally served as a simple aid in understanding the mechanics of
publishing to NPM while also an excuse to play around with generator functions,
which I generally don't find many use-cases for in day-to-day app development -
for the same reason this package has limited application.

## install

### Node

```none
> npm install with-iterator
```

```javascript
import { withIterator } from 'with-iterator'
```

### Deno

```javascript
import { withIterator } from 'npm:with-iterator'
```

### TypeScript

Depending on existing environment or project setup the following minimal
config may also be required. `strictNullChecks` is optional but will
improve type resolution if enabled.

```json
{
    "compilerOptions": {
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
    descriptor?: PropertyDescriptor,
): Iterable
```

```typescript
function withIterator(
    factory: () => Generator,
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

### isIterable

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

» [StackBlitz examples][repo:examples]

### usage

```js
import { withIterator, isIterable, getIterator, valueOf } from 'with-iterator'
```

By default if not passed a factory function, any input is assigned
an iterator that yields itself, if it isn't already iterable - else
it is unchanged.

```js
Array.from(withIterator([1, 2, 3])) // [ 1, 2, 3 ]
Array.from(withIterator({ value: true })) // [ { value: true } ]
```

When explicitly passed a factory, any existing iterator is superseded.

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
const rgb = withIterator(function* () {
    const re = /../g
    let next
    while ((next = re.exec(this))) yield Number.parseInt(next, 16)
})
hex.map(rgb).forEach((code) => {
    console.log(`hex: ${code} - rgb: (${[...code]})`)
})
// hex: 123456 - rgb: (18,52,86)
// hex: cc9933 - rgb: (204,153,51)
// hex: fedcba - rgb: (254,220,186)
```

Assigning an iterator to a class prototype.

```js
class Digits extends Number {}
withIterator(function* () {
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
    valueOf(num), // 42
)
```

[repo:github]: https://github.com/mylesj/with-iterator
[repo:package]: https://www.npmjs.com/package/with-iterator
[repo:examples]: https://stackblitz.com/~/edit/with-iterator?file=index.mjs&view=editor
[repo:types]: https://github.com/mylesj/with-iterator/blob/master/types.d.ts
[ext:defineproperty]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
[ext:coveralls]: https://coveralls.io/github/mylesj/with-iterator?branch=master
[img:github]: https://img.shields.io/badge/%20-Source-555555?logo=github&style=for-the-badge
[img:npm-version]: https://img.shields.io/npm/v/with-iterator?&label=%20&logo=npm&style=for-the-badge
[img:coveralls]: https://img.shields.io/coverallsCoverage/github/mylesj/with-iterator?branch=master&style=for-the-badge&logo=coveralls
