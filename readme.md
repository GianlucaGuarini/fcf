# FCF

# <img alt="FCF.js" src="https://raw.githubusercontent.com/GianlucaGuarini/fcf/master/FCF-logo.svg" width="100%"/>

[![Build Status][travis-image]][travis-url]
[![MIT License][license-image]][license-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![Coverage Status][coverage-image]][coverage-url]
![FCF Size][lib-size]
[![Code Quality][codeclimate-image]][codeclimate-url]

# What is FCF?

FCF is a Monadic Functional Control Flow Micro-Library for Javascript written in Typescript.
It aims at providing a functional and semantic alternative to some native Javascript control flow statements like `if`, `switch` and `while`.

Keywords like `if` or `switch` are imperative statements that normally must be combined to functions to give them a semantic meaning for example:

```js
// BAD imperative (non semantic)
if (document.visibilityState === 'visible') {
  // do stuff with visible document
} else if(document.visibilityState === 'hidden') {
  // do stuff with hidden document
}
```

```js
// a bit better... with a semantic functions
const isDocumentVisible = () => document.visibilityState === 'visible'
const isDocumentHidden = () => document.visibilityState === 'hidden'

// notice that here that we didn't store the value of the conditions
// for that we need to introduce new variables
if (isDocumentVisible()) {
  // do stuff with visible document
} else if (isDocumentHidden()) {
  // do stuff with hidden document
}
```

With FCF we can write the example above in a more semantic way retaining the value of our conditional statement:

```js
import fcf from 'fcf'

const checkIfApplicationIsActive = fcf
  .if(value => value === 'visible')
  .then(() => {
    // do stuff with visible document

    return 'active'
  })
  .elseIf(value => value === 'hidden')
  .then(() => {
    // do stuff with hidden document

    return 'standby'
  })

// check the condition
const {value} = checkIfApplicationIsActive.run(document.visibilityState)

// the value returned by the first `then` call matched ('active'|'standby')
console.log(value)
```

Notice that FCF is strictly typed so you can rewrite the example above in typescript in this way:

```ts
import fcf from 'fcf'

const checkIfApplicationIsActive = fcf
  // with `[string]` you can define the type of arguments provided to the 'run' function
  // `string` is the value retained by the fcf.if object
  .if<[string], string>(value => value === 'visible')
  .then(() => {
    // do stuff with visible document
    return 'active'
  })
  // `value` here is of type `string`
  .elseIf(value => value === 'hidden')
  .then(() => {
    // do stuff with hidden document
    return 'standby'
  })

// check the condition
const {value} = checkIfApplicationIsActive.run(document.visibilityState)

// will be of type "string"
console.log(value)
```

## IfFlow - fcf.if

`fcf.if` provides an alternative to the native Javascript `if` statement.

Any `fcf.if` object has the following properties
  - `else(function)` - provide a fallback method if none of the conditions are matched
  - `elseIf(function|any)` - add a new condition that must be followed by a `then` call
  - `then(function)` - add a callback to a previously set condition and set the `value` property
  - `value` - value returned by the first `then` call matching
  - `run(...args: any[])` - run the condition flow passing eventually arguments to it

<details>
 <summary>Examples</summary>

### simple

The simplest `fcf.if` might look like this:

```js
fcf
  .if(true)
  .then(() => {
    console.log('hello')
  })
  .run()
```

### if-else

The `else` method works like for normal `if` statements

```js
fcf
  .if(false)
  .then(() => {
    console.log('you will never get here')
  })
  .else(() => {
    console.log('hello')
  })
  .run()
```

### if-else-if

With the `elseIf` method you can add new conditions

```js
fcf
  .if(true)
  .then(() => {
    console.log('you will never get here')
  })
  .elseIf(false)
  .then(() => {
    console.log('hello')
  })
  .run()
```

### functional conditions

The `fcf.if` `elseIf` and `if` methods accept also functions as argument.

```js
fcf
  .if(() => true)
  .then(() => {
    console.log('you will never get here')
  })
  .elseIf(() => false)
  .then(() => {
    console.log('hello')
  })
  .run()
```

### functional conditions with arguments

The `fcf.if` `run` method allows you to pass arguments into your ifFlow chain

```js
fcf
  .if(greeting => greeting === 'goodbye')
  .then(() => {
    console.log('goodbye')
  })
  .elseIf(greeting => greeting === 'hello')
  .then(() => {
    console.log('hello')
  })
  .run('hello')
```

### value property

The `fcf.if` objects will retain the value returned by the first `then` call matched

```js
const {value} = fcf
  .if(greeting => greeting === 'goodbye')
  .then(() => {
    return 'goodbye'
  })
  .elseIf(greeting => greeting === 'hello')
  .then(() => {
    return 'hello'
  })
  .run('hello')

console.log(value) // hello
```
</details>


## SwitchFlow - fcf.switch

TODO

## WhileFlow - fcf.while

TODO

## TODO

- Provide async functions support
- Add more control flow methods


[license-image]:https://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:license.txt

[coverage-image]:https://coveralls.io/repos/github/GianlucaGuarini/fcf/badge.svg
[coverage-url]:https://coveralls.io/github/GianlucaGuarini/fcf

[codeclimate-image]:https://api.codeclimate.com/v1/badges/c952f55dd5421e6e04cf/maintainability
[codeclimate-url]:https://codeclimate.com/github/GianlucaGuarini/fcf/maintainability

[travis-image]:https://travis-ci.org/GianlucaGuarini/fcf.svg?branch=master
[travis-url]:https://travis-ci.org/GianlucaGuarini/fcf.svg?branch=master


[lib-size]: https://img.badgesize.io/https://unpkg.com/fcf/fcf.min.js?compression=gzip

[npm-version-image]:https://img.shields.io/npm/v/fcf.svg?style=flat-square
[npm-downloads-image]:https://img.shields.io/npm/dm/fcf.svg?style=flat-square
[npm-url]:https://npmjs.org/package/fcf