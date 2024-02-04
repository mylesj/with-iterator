import { expect } from 'chai'

import { boxed } from '../src/utils.mjs'

describe('boxed', () => {
    it('should pass-through object references', () => {
        const ref = {}
        expect(boxed(ref)).to.equal(ref)
    })

    describe('should return boxed primitives that can resolve initial input', () => {
        const toTest = [
            ['null', null],
            ['undefined', undefined],
            ['string', 'str'],
            ['number', 42],
            ['boolean', true],
            ['symbol', Symbol('sym')],
        ]
        toTest.forEach(([name, input]) =>
            it(name, () => {
                const boxedInput = boxed(input)
                expect(typeof boxedInput).to.equal('object')
                expect(boxedInput.valueOf()).to.equal(input)
            }),
        )
    })
})
