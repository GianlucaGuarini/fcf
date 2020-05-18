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
})