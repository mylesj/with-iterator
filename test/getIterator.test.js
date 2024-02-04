import { expect } from 'chai'

import { getIterator, withIterator } from '../src/index.mjs'

describe('getIterator', () => {
    describe('when passed an object with an iterator', () => {
        it('should return undefined if the value is not a function', () => {
            const obj = { [Symbol.iterator]: true }
            expect(getIterator(obj)).to.equal(undefined)
        })

        it('should return a function if it exists', () => {
            const obj = withIterator({})
            expect(typeof getIterator(obj)).to.equal('function')
        })
    })

    describe('when passed a function', () => {
        it('should return iterators on a constructable prototype', () => {
            class Test {}
            const iterator = function* () {}
            withIterator(iterator, Test.prototype)
            expect(getIterator(Test)).to.equal(iterator)
        })

        it('should prioritise own properties even if erroneous', () => {
            class Test {}
            withIterator(Test.prototype)
            Test[Symbol.iterator] = true
            expect(getIterator(Test)).to.equal(undefined)
        })

        it('should not be perturbed by non-constructables', () => {
            expect(getIterator(() => {})).to.equal(undefined)
        })
    })

    describe('when passed an iterable', () => {
        it('should return a working iterator', () => {
            const defaultIterator = getIterator(withIterator(undefined))
            const str = withIterator(defaultIterator, 'string')
            expect(Array.from(str)[0]).to.equal('string')
        })

        it('should work with primitives', () => {
            const iterator = getIterator('string')
            const num = withIterator(iterator, 42)
            expect(Array.from(num)).to.deep.equal(['4', '2'])
        })

        it('should work with native prototypes', () => {
            const iterator = getIterator(String)
            const num = withIterator(iterator, 42)
            expect(Array.from(num)).to.deep.equal(['4', '2'])
        })
    })
})
