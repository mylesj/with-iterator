import { expect } from 'chai'

import { withIterator } from '../src/index.mjs'

describe('withIterator', () => {
    it('should maintain object references', () => {
        const item = { value: true }
        const iter = withIterator(() => {}, item)
        expect(iter).to.equal(item)
    })

    it('should assign a non-enumerable property by default', () => {
        const iter = withIterator({ value: true })
        expect({ ...iter }).to.deep.equal({ value: true })
    })

    describe('when empty types are boxed', () => {
        it('should be able to resolve the value of null', () => {
            const iter = withIterator(null)
            expect(Array.from(iter)[0]).to.equal(null)
        })

        it('should be able to resolve the value of undefined', () => {
            const iter = withIterator(undefined)
            expect(Array.from(iter)[0]).to.equal(undefined)
        })

        it('should resolve the value of null as a second argument', () => {
            const iter = withIterator(undefined, null)
            expect(Array.from(iter)[0]).to.equal(null)
        })

        it('should resolve the value of undefined as a second argument', () => {
            const iter = withIterator(undefined, undefined)
            expect(Array.from(iter)[0]).to.equal(undefined)
        })

        it('undefined should be immutable', () => {
            const und = withIterator(undefined)
            try {
                und.test = 'value'
                expect(und.test).to.equal(undefined)
            } catch (e) {
                expect(e.message).to.include('not extensible')
            }
        })

        it('null should be immutable', () => {
            const nul = withIterator(null)
            try {
                nul.test = 'value'
                expect(nul.test).to.equal(undefined)
            } catch (e) {
                expect(e.message).to.include('not extensible')
            }
        })
    })

    describe('when iterator unspecified', () => {
        describe('applied to composite types', () => {
            it('should yield the same object', () => {
                const item = { value: true }
                const iter = withIterator(item)
                expect(Array.from(iter)[0]).to.equal(item)
            })

            it('should delegate to existing iterators', () => {
                const item = Object.assign(
                    { value: true },
                    {
                        [Symbol.iterator]: function* () {
                            yield { value: false }
                        },
                    },
                )
                const iter = withIterator(item)
                expect(Array.from(item)[0]).to.deep.equal({ value: false })
            })

            it('should respect the prototype chain', () => {
                const proto = {
                    [Symbol.iterator]: function* () {
                        yield this.a
                        yield this.b
                        yield this.c
                    },
                }
                const item = Object.create(proto, {
                    a: { value: 1 },
                    b: { value: 2 },
                    c: { value: 3 },
                })
                const iter = withIterator(item)
                expect(Array.from(iter)).to.deep.equal([1, 2, 3])
            })
        })

        describe('applied to primitive types', () => {
            describe('if no iterator exists on the prototype', () => {
                describe('should return an object of the same type', () =>
                    [
                        [1, Number],
                        [true, Boolean],
                        [Symbol.iterator, Symbol],
                    ].forEach(([item, Type]) =>
                        it(Type.name, () =>
                            expect(withIterator(item) instanceof Type).to.equal(
                                true,
                            ),
                        ),
                    ))
            })

            describe('if an iterator exists on the prototype', () => {
                describe('should return the primitive value', () => {
                    it('String', () =>
                        expect(withIterator('str') instanceof String).to.equal(
                            false,
                        ))
                })
            })

            describe('has an iterator returning scalar values', () => {
                ;[1, true, 'str', Symbol()].forEach((value) =>
                    it(Object(value).constructor.name, () => {
                        const item = withIterator(value)
                        expect(Array.from(item)).to.include.members(
                            value === 'str' ? ['s', 't', 'r'] : [value],
                        )
                    }),
                )
            })
        })
    })

    describe('when iterator specified', () => {
        it('should not delegate to existing iterators', () => {
            const item = Object.assign([1, 2, 3], {
                [Symbol.iterator]: function* () {
                    yield this
                },
            })
            const iter = withIterator(item)
            expect(Array.from(iter)[0]).to.equal(item)
        })

        it('should curry if object unspecified', () => {
            const curried = withIterator(function* () {
                yield 'curry'
            })
            const item = curried({})
            expect(Array.from(item)[0]).to.equal('curry')
        })
    })
})
