import { expect } from 'chai'
import ifFlow from '../src/if'

const noop: () => void = () => {} // eslint-disable-line

describe('if - spec', () => {
  it('simple if condition', done => {
    ifFlow(true)
      .then(() => done())
      .elseIf(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()
  })

  it('simple if with no matches', () => {
    ifFlow(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .elseIf(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()
  })

  it('simple if else condition', done => {
    ifFlow(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .elseIf(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .else(() => done())
      .run()
  })

  it('simple if condition value', done => {
    const {value} = ifFlow(true)
      .then(() => {
        done()
        return 'hello'
      })
      .elseIf(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()

    expect(value).to.be.equal('hello')
  })

  it('simple if with no matches value', () => {
    const {value} = ifFlow(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .elseIf(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()

    expect(value).to.be.not.ok
  })

  it('simple if else condition value', done => {
    const {value} = ifFlow(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .elseIf(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .else(() => {
        done()
        return 'hello'
      })
      .run()

    expect(value).to.be.equal('hello')
  })

  it('simple if else-if condition', done => {
    ifFlow(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .else(() => {
        throw new Error('you shouldn\'t get here')
      })
      .elseIf(true)
      .then(() => done())
      .run()
  })

  it('function if condition', done => {
    ifFlow(() => true)
      .then(() => done())
      .elseIf(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()
  })

  it('function if else condition', done => {
    ifFlow(() => false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .else(() => done())
      .run()
  })

  it('function if else-if condition', done => {
    ifFlow(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .else(() => {
        throw new Error('you shouldn\'t get here')
      })
      .elseIf(() => true)
      .then(() => done())
      .run()
  })

  it('function if condition arguments', done => {
    ifFlow((greeting: string) => {
      expect(greeting).to.be.equal('hello')
      return greeting
    })
      .then(() => done())
      .run('hello')
  })

  it('function if else condition arguments', done => {
    ifFlow(() => false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .else((greeting: string) => {
        expect(greeting).to.be.equal('hello')
        done()
      })
      .run('hello')
  })

  it('function if else-if condition arguments', done => {
    ifFlow(() => false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .else(() => {
        throw new Error('you shouldn\'t get here')
      })
      .elseIf((greeting: string) => {
        expect(greeting).to.be.equal('hello')

        return true
      })
      .then((greeting: string) => {
        expect(greeting).to.be.equal('hello')
        done()
      })
      .run('hello')
  })

  it('error - too many conditions without then', () => {
    const ifFn = ifFlow(true).then(noop)

    expect(() => ifFn.then(noop)).to.throw()
  })

  it('error - too many else statements', () => {
    const ifFn = ifFlow(true).else(noop)

    expect(() => ifFn.else(noop)).to.throw()
  })

  it('error - too many conditons without then', () => {
    const ifFn = ifFlow(true)

    expect(() => ifFn.elseIf(noop)).to.throw()
  })
})