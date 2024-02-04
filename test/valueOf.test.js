import { expect } from 'chai'

import { valueOf, withIterator } from '../src/index.mjs'

describe('valueOf', () => {
    it('should pass-through object references', () => {
        const ref = {}
        expect(valueOf(ref)).to.equal(ref)
    })

    describe('should return primitive types as-is', () => {
        const toTest = [
            ['null', null],
            ['undefined', undefined],
            ['string', 'str'],
            ['number', 42],
            ['boolean', true],
            ['symbol', Symbol('sym')],
        ]
        toTest.forEach(([name, input]) =>
            it(name, () => expect(valueOf(input)).to.equal(input)),
        )
    })

    describe('should return boxed primitives as primitives', () => {
        const toTest = [
            ['null', null],
            ['undefined', undefined],
            ['string', 'str'],
            ['number', 42],
            ['boolean', true],
            ['symbol', Symbol('sym')],
        ]
        toTest.forEach(([name, input]) =>
            it(name, () =>
                expect(valueOf(withIterator(input))).to.equal(input),
            ),
        )
    })
})
