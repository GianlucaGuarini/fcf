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

## Native Imperative Flow Statements

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

## Functional Control Flow

With FCF we can write your program flow in a more semantic way retaining the value of its conditional statement:

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

Another big advantage of FCF is that its API is composable:

```js
const greetUserByRole = fcf
  .switch(user => user.role)
  .case('power')
  .then(() => {
    console.log('Good morning power user')
  })
  .case('base')
  .then(() => {
    console.log('hello base user')
  })
  .default(() => {
    console.log('hello base user')
  })

const checkUser = fcf
  .if(user => user.isLogged)
  .then(user => greetUserByRole.run(user))
  .else(() => {
    console.log('you are not logged in')
  })

checkUser.run({
  role: 'power',
  isLogged: true
})

checkUser.run({
  role: 'base',
  isLogged: true
})

checkUser.run({
  role: 'power',
  isLogged: false
})
```

[Check Live the example above](https://plnkr.co/edit/GXPF1W04RWC9WLbf)

## IfFlow - fcf.if

`fcf.if` provides an alternative to the native Javascript `if` statement.

```js
fcf
  .if(true)
  .then(() => {
    console.log('hello')
  })
  .run()
```

Any `fcf.if` object has the following properties
  - `else(fn: function)` - provide a fallback method if none of the conditions are matched
  - `elseIf(fn: function|any)` - add a new condition that must be followed by a `then` call
  - `then(fn: function)` - add a callback to a previous condition and set the `value` property
  - `value` - value returned by the first matching `then` call
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

The `fcf.if` and `fcf.if.elseIf` methods accept also functions as argument.

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

The `fcf.if.run` method allows you to pass arguments into your ifFlow chain

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

`fcf.switch` provides an alternative to the native Javascript `switch` statement.
It normalizes also the default `switch` behavior avoiding the need of `break` statements: the first `case` matched will avoid the evaluation of the others

```js
fcf
  .switch(greeting => greeting)
  .case('hello')
  .then(() => {
    console.log('hello')
  })
  .case('goodbye')
  .then(() => {
    console.log('goodbye')
  })
  .default(() => {
    console.log('¯\\_(ツ)_/¯ ')
  })
  .run('goodbye')
```

Any `fcf.switch` object has the following properties
  - `default(fn: function)` - provide a fallback method if none of the `case` is matched
  - `case(fn: function|any)` - add a new case that must be followed by a `then` call
  - `then(fn: function)` - add a callback to a previous `case` call and can set the `value` property
  - `value` - value returned by the first matching `then` call
  - `run(...args: any[])` - run the condition flow passing eventually arguments to it

<details>
 <summary>Examples</summary>

### simple

The simplest `fcf.switch` might look like this:

```js
fcf
  .switch(greeting => greeting)
  .case('hello')
  .then(() => {
    console.log('hello')
  })
  .case('goodbye')
  .then(() => {
    console.log('goodbye')
  })
  .default(() => {
    console.log('¯\\_(ツ)_/¯ ')
  })
  .run('goodbye')
```

### switch-default

The `default` method works like for normal `switch` statements: if no `case` is matched the `default` method will be called.

```js
fcf
  .switch(greeting => greeting)
  .case('goodbye')
  .then(() => {
    console.log('you will never get here')
  })
  .default(greeting => {
    console.log(greeting)
  })
  .run('hello')
```

### functional cases

The `fcf.switch` and `fcf.switch.case` methods accept also functions as argument.

```js
fcf
  .switch(greeting => greeting)
  .case(() => 'goodbye')
  .then(() => {
    console.log('goodbye')
  })
  .case(() => 'hello')
  .then(() => {
    console.log('hello')
  })
  .run('hello')
```

### functional cases with arguments

The `fcf.switch.run` method allows you to pass arguments into your switchFlow chain

```js
fcf
  .switch(greeting => greeting)
  .case(greeting => greeting === 'goodbye')
  .then(() => {
    console.log('goodbye')
  })
  .case(greeting => greeting === 'hello')
  .then(() => {
    console.log('hello')
  })
  .run('hello')
```

### value property

The `fcf.switch` objects will retain the value returned by the first `then` call matched

```js
const {value} = fcf
  .switch(greeting => greeting)
  .case(greeting => greeting === 'goodbye')
  .then(() => {
    return 'goodbye'
  })
  .case(greeting => greeting === 'hello')
  .then(() => {
    return 'hello'
  })
  .run('hello')

console.log(value) // hello
```
</details>



## WhileFlow - fcf.while

`fcf.while` provides an alternative to the native Javascript `while` statement.
It normalizes its behavior in browsers and node using `requestAnimationFrame` or `setImmediate` to run loops

```js
fcf
  .while(true)
  .do(() => {
    console.log('hello')
  })
  .run()
```

Any `fcf.while` object has the following properties
  - `do(fn: function)` - add a callback that will be called forever when the whileFlow is running. If a `do` function will return `false` the while flow will be stopped
  - `break(fn?: function)` - if called, it will stop the while flow. It accepts eventually a callback to call when the flow will be stopped
  - `value` - value returned by the initial control function
  - `run(...args: any[])` - run the while flow passing eventually arguments to it

<details>
 <summary>Examples</summary>

 ### simple

The simplest `fcf.while` might look like this:

```js
fcf
  .while(true)
  .do(() => {
    console.log('hello')
  })
  .run()
```

### break

The `break` allows to stop the while flow

```js
const loggerFlow = fcf
  .while(true)
  .do(() => {
    console.log('hello')
  })
  .run()

// stop the while loop after 1 second
setTimeout(() => {
  loggerFlow.break()
}, 1000)
```

### functional control function

The `fcf.while` method accept also functions as argument.

```js
fcf
  // it will log until the document.visibilityState === 'visible'
  // otherwise it will be stopped
  .while(() => document.visibilityState === 'visible')
  .do(() => {
    console.log('hello')
  })
  .run()
```

### stop the while flow from a do function

The `fcf.while.do` can stop the while flow returning `false`

```js
fcf
  .while(true)
  // it will log only once and then stop the while flow
  .do(() => {
    console.log('hello')
    return false
  })
  .run()
```

### functional with arguments

The `fcf.while.run` method allows you to pass arguments into your whileFlow chain

```js
const greetUser = fcf
  .switch(user => user.role)
  .case('power')
  .then(() => {
    console.log('Good morning power user')
  })
  .then('base')
  .then(() => {
    console.log('hello base user')
  })
  .default(() => {
    console.log('hello base user')
  })

fcf
  .while(true)
  .do(user => greetUser.run(user))
  .run(user)
```

### value property

The `fcf.while` objects will retain the value returned by its initial control function

```js
const {value} = fcf
  .while(true)
  .do(() => {
    console.log('hello')
  })
  .run('hello')

console.log(value) // true
```
</details>

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