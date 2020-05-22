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

FCF is a Functional Control Flow Micro-Library for JavaScript written in
TypeScript. It aims to provide a functional and semantic alternative to native
JavaScript control flow statements such as `if`, `switch` and `while`.

## Native Imperative Flow Statements

Keywords like `if` or `switch` are imperative statements whose syntax can often
complicate or obscure an expression's semantics, e.g.:

```js
// BAD imperative (non semantic)
if (document.visibilityState === 'visible') {
  // do stuff with the visible document
} else if (document.visibilityState === 'hidden') {
  // do stuff with the hidden document
}
```

```js
// a bit better... with semantic functions
const isDocumentVisible = () => document.visibilityState === 'visible'
const isDocumentHidden = () => document.visibilityState === 'hidden'

// notice that we don't store the value of the conditions here.
// for that we need to introduce new variables
if (isDocumentVisible()) {
  // do stuff with the visible document
} else if (isDocumentHidden()) {
  // do stuff with the hidden document
}
```

## Functional Control Flow

With FCF, we can structure the program flow in a more semantic way, while
retaining the logic of its conditional statements:

```js
import fcf from 'fcf'

const checkIfApplicationIsActive = fcf
  .if(value => value === 'visible')
  .then(() => {
    // do stuff with the visible document
    return 'active'
  })
  .elseIf(value => value === 'hidden')
  .then(() => {
    // do stuff with the hidden document
    return 'standby'
  })

// check the condition
const {value} = checkIfApplicationIsActive.run(document.visibilityState)

// the value returned by the first matched `then` call ('active'|'standby')
console.log(value)
```

Notice that FCF is strictly typed so we can rewrite the example above in
TypeScript in this way:

```typescript
import fcf from 'fcf'

const checkIfApplicationIsActive = fcf
  // with `[string]` we can define the type of arguments provided to the 'run' function.
  // `string` is the value retained by the fcf.if object
  .if<[string], string>(value => value === 'visible')
  .then(() => {
    // do stuff with the visible document
    return 'active'
  })
  // `value` here is of type `string`
  .elseIf(value => value === 'hidden')
  .then(() => {
    // do stuff with the hidden document
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
    console.log('good morning, power user')
  })
  .case('base')
  .then(() => {
    console.log('hello, base user')
  })
  .default(() => {
    console.log('hello, whoever you are')
  })

const checkUser = fcf
  .if(user => user.isLoggedIn)
  .then(user => greetUserByRole.run(user))
  .else(() => {
    console.log('you are not logged in')
  })

checkUser.run({
  role: 'power',
  isLoggedIn: true
})

checkUser.run({
  role: 'base',
  isLoggedIn: true
})

checkUser.run({
  role: 'power',
  isLoggedIn: false
})
```

[Check a live demo of the example above](https://plnkr.co/edit/GXPF1W04RWC9WLbf)

## IfFlow - fcf.if

`fcf.if` provides an alternative to the native JavaScript `if` statement.

```js
fcf
  .if(true)
  .then(() => {
    console.log('hello')
  })
  .run()
```

An `fcf.if` object has the following properties
  - `else(fn: function)` - provide a fallback method if none of the conditions are matched
  - `elseIf(fn: function|any)` - add a new condition that must be followed by a `then` call
  - `then(fn: function)` - add a callback to a previous condition and set the `value` property
  - `value` - value returned by the first matching `then` call
  - `run(...args: any[])` - execute the flow, passing any supplied arguments into it

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

The `else` method works the same as it does for `if` statements

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

With the `elseIf` method, we can add new conditions

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

The `fcf.if` and `fcf.if.elseIf` methods also accept functions as arguments.

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

The `fcf.if` object retains the value returned by the first matched `then` call

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

`fcf.switch` provides an alternative to the native JavaScript `switch`
statement. It also normalizes the default `switch` behavior, avoiding the need
for `break` statements: the first matched `case` pre-empts evaluation of
the other cases

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

An `fcf.switch` object has the following properties
  - `default(fn: function)` - provide a fallback method if no `case` is matched
  - `case(fn: function|any)` - add a new case that must be followed by a `then` call
  - `then(fn: function)` - add a callback to a previous `case` call and optionally set the `value` property
  - `value` - value returned by the first matching `then` call
  - `run(...args: any[])` - execute the flow, passing any supplied arguments into it

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

The `default` method works the same as in regular `switch` statements: if no `case` is
matched, the `default` method is called.

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

The `fcf.switch` and `fcf.switch.case` methods also accept functions as arguments.

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

The `fcf.switch` objects retain the value returned by the first matched `then`
call

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

`fcf.while` provides an alternative to the native JavaScript `while` statement.
It normalizes its behavior in browsers and Node.js by using
`requestAnimationFrame` or `setImmediate` to run loops

```js
fcf
  .while(true)
  .do(() => {
    console.log('hello')
  })
  .run()
```

An `fcf.while` object has the following properties
  - `do(fn: function)` - add a callback that will be called forever when the whileFlow is running. If a `do` function returns `false`, the while flow is stopped
  - `break(fn?: function)` - if called, it stops the while flow. It can take a callback to be called when the flow is stopped
  - `value` - value returned by the initial control function
  - `run(...args: any[])` - execute the flow, passing any supplied arguments into it

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

The `break` allows the while flow to be stopped

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

The `fcf.while` method can also take a function as an argument.

```js
fcf
  // log until document.visibilityState === 'visible'.
  // otherwise stop
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
  // it logs only once and then stops the while flow
  .do(() => {
    console.log('hello')
    return false
  })
  .run()
```

### functional with arguments

The `fcf.while.run` method allows you to pass arguments into your whileFlow
chain

```js
const greetUser = fcf
  .switch(user => user.role)
  .case('power')
  .then(() => {
    console.log('good morning, power user')
  })
  .then('base')
  .then(() => {
    console.log('hello, base user')
  })
  .default(() => {
    console.log('hello, base user')
  })

fcf
  .while(true)
  .do(user => greetUser.run(user))
  .run(user)
```

### value property

The `fcf.while` object retains the value returned by its initial control
function

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

- Provide support for async functions
- Add more control-flow methods

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
