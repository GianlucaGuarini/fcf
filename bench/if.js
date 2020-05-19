const Benchmark = require('benchmark')
const fcf = require('../')
const suite = new Benchmark.Suite()
const ifFlow = fcf
  .if(value => value)
  .then(() => 'goodbye'.toUpperCase())
  .else(() => 'hello'.toUpperCase())

const nativeFunction = value => {
  if (value) {
    return 'goodbye'.toUpperCase()
  } else {
    return 'hello'.toUpperCase()
  }
}

let i = 0

module.exports = () => {
  return new Promise(r => {
    // add tests
    suite.add('fcf.if', function() {
      i++
      ifFlow.run(i % 2 === 0)
    })
    .add('Native if', function() {
      i++
      nativeFunction(i % 2 === 0)
    })
    // add listeners
    .on('cycle', function(event) {
      console.log(String(event.target))
    })
    .on('complete', function() {
      console.log(`Fastest is ${this.filter('fastest').map('name')}`)
      r()
    })
    .run()
  })
}

