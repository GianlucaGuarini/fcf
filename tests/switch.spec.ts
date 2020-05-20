import { expect } from 'chai'
import switchFlow from '../src/switch'

const noop: () => void = () => {} // eslint-disable-line

describe('switch - spec', () => {
  it('simple switch', done => {
    switchFlow(true)
      .case(true)
      .then(() => done())
      .case(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()
  })

  it('simple switch with no matches', () => {
    switchFlow(true)
      .case(0)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .case(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()
  })

  it('simple switch default statement', done => {
    switchFlow(false)
      .case(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .case(1)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .default(() => done())
      .run()
  })

  it('simple switch value', done => {
    switchFlow(true)
      .case(true)
      .then(() => done())
      .case(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()
  })

  it('simple switch with no matches value', () => {
    const {value} = switchFlow(true)
      .case(0)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .case(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()

    expect(value).to.be.not.ok
  })

  it('simple switch default statement value', done => {
    const {value} = switchFlow(false)
      .case(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .case(1)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .default(() => {
        done()

        return 'hello'
      })
      .run()

    expect(value).to.be.equal('hello')
  })

  it('simple switch with unordered default statement', done => {
    switchFlow(true)
      .case(0)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .default(() => {
        throw new Error('you shouldn\'t get here')
      })
      .case(true)
      .then(() => done())
      .run()
  })

  it('function switch', done => {
    switchFlow(() => true)
      .case(true)
      .then(() => done())
      .case(false)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .run()
  })


  it('function switch with default statement', done => {
    switchFlow(() => false)
      .case(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .default(() => done())
      .run()
  })

  it('function switch with unordered default statement', done => {
    switchFlow(false)
      .case(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .default(() => {
        throw new Error('you shouldn\'t get here')
      })
      .case(() => false)
      .then(() => done())
      .run()
  })

  it('function switch with arguments', done => {
    switchFlow((greeting: string) => {
      expect(greeting).to.be.equal('hello')
      return greeting
    })
      .case('hello')
      .then(() => done())
      .run('hello')
  })

  it('function switch and default statement with condition arguments', done => {
    switchFlow(() => false)
      .case(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .default((greeting: string) => {
        expect(greeting).to.be.equal('hello')
        done()
      })
      .run('hello')
  })

  it('function switch with multiple cases and arguments', done => {
    switchFlow<[string]>((greeting: string) => greeting)
      .case(true)
      .then(() => {
        throw new Error('you shouldn\'t get here')
      })
      .default(() => {
        throw new Error('you shouldn\'t get here')
      })
      .case((greeting: string) => {
        expect(greeting).to.be.equal('hello')

        return greeting
      })
      .then((greeting) => {
        expect(greeting).to.be.equal('hello')
        done()
      })
      .run('hello')
  })

  it('error - not enough cases for then statements', () => {
    expect(() => switchFlow(true).then(noop)).to.throw()
  })

  it('error - too many default statements', () => {
    const ifFn = switchFlow(true).default(noop)

    expect(() => ifFn.default(noop)).to.throw()
  })

  it('error - too many cases without then', () => {
    const ifFn = switchFlow(true).case(true)

    expect(() => ifFn.case(false)).to.throw()
  })
})
