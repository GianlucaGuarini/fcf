import { expect } from 'chai'
import whileFlow from '../src/while'

const noop: () => void = () => {} // eslint-disable-line

describe('while - spec', () => {
  it('simple while loop', done => {
    const counter = {
      i: 0
    }

    whileFlow(() => true)
      .do(() => {
        counter.i ++

        if (counter.i === 3) {
          done()
          return false
        }
      })
      .run()
  })

  it('while loop break', done => {
    const counter = {
      i: 0
    }

    whileFlow(() => true)
      .do(() => {
        counter.i ++
      })
      .run()
      .break(() => {
        expect(counter.i).to.be.equal(0)
        done()
      })
  })

  it('while loop multiple do calls', done => {
    const counter = {
      i: 0
    }

    whileFlow(() => true)
      .do(noop)
      .do(() => {
        counter.i ++
      })
      .do(() => {
        if (counter.i === 3) {
          done()
          return false
        }
      })
      .run()
  })

  it('while loop value', done => {
    const counter = {
      i: 0
    }

    const whileFn = whileFlow(() => true)
      .do(noop)
      .do(() => {
        counter.i ++
      })
      .do(() => {
        if (counter.i === 3) {
          expect(whileFn.value).to.be.equal(true)
          done()
          return false
        }
      })
      .run()
  })

  it('while loop value', done => {
    const counter = {
      i: 0
    }

    const whileFn = whileFlow(() => true)
      .do(noop)
      .do(() => {
        counter.i ++
      })
      .do(() => {
        if (counter.i === 3) {
          expect(whileFn.value).to.be.equal(true)
          done()
          return false
        }
      })
      .run()
  })

  it('while loop can not be runned twice', () => {
    const whileFn = whileFlow(() => true).run()

    expect(() => whileFn.run()).to.throw()
    expect(() => whileFn.break()).to.not.throw()
  })

  it('while loop can not be broken if never started', () => {
    const whileFn = whileFlow(() => true)

    expect(() => whileFn.break()).to.throw()
  })
})