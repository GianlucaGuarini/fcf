const Benchmark = require('benchmark')
const fcf = require('../')
const suite = new Benchmark.Suite()
const falsyReturn = () => false
const ifFlow = fcf
  .if(falsyReturn)
  .then(() => {
    throw new Error('error')
  })
  .else(() => 'hello'.toUpperCase())


module.exports = () => {
  return new Promise(r => {
    // add tests
    suite.add('fcf.if', function() {
      ifFlow.run()
    })
      .add('Native if', function() {
        if (falsyReturn()) {
          throw new Error('error')
        } else {
          'hello'.toUpperCase()
        }
      })
      // add listeners
      .on('cycle', function(event) {
        console.log(String(event.target))
      })
      .on('complete', function() {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`)

        r()
      })
    // run async
      .run()
  })
}

