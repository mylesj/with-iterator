import { expect } from 'chai'

import { isIterable } from '../src/index.mjs'

describe('isIterable', () => {
    describe('when there is no input', () => {
        it('should be false when undefined', () => {
            expect(isIterable(undefined)).to.equal(false)
        })

        it('should be false when null', () => {
            expect(isIterable(null)).to.equal(false)
        })
    })

    describe('when input is a composite type', () => {
        it('should be false for non-iterable objects', () => {
            expect(isIterable(Object())).to.equal(false)
        })

        it('should be true for iterable objects', () => {
            expect(isIterable(Array())).to.equal(true)
        })
    })

    describe('when the input is a primitive type', () => {
        it('should be false for non-iterable values', () => {
            expect(isIterable(1)).to.equal(false)
        })

        it('should be true if the prototype has an iterator', () => {
            expect(isIterable('string-literal')).to.equal(true)
        })
    })
})
