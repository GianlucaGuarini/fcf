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
// imperative (no semantic)
if (document.visibilityState === 'visible') {
  // do stuff
}

// semantic function
const isDocumentVisible = () => document.visibilityState === 'visible'

if (isDocumentVisible()) {
  // do stuff
  // notice that here we don't know the value of document.visibilityState
}
```

With FCF we can write the example above in a more semantic way retaining the value of our conditional statement:

```js
import fcf from 'fcf'

const documentVisibleCondition = fcf
  .if(documentVisibilityState => documentVisibilityState === 'visible')
  .then(() => {
    // do stuff
  })

// check the condition
const {value} = documentVisibleCondition.run(document.visibilityState)

// the value returned by the first condition matched
// in this case documentVisibilityState === 'visible'
console.log(value)
```

Notice that FCF is strictly typed so you can rewrite the example above in typescript in this way:

```ts
import fcf from 'fcf'

const documentVisibleCondition = fcf
  // with `[string]` you can define the type of arguments provided to the 'run' function
  // `boolean` is the value retained by the fcf.if object
  .if<[string], boolean>(documentVisibilityState => documentVisibilityState === 'visible')
  .then(() => {
    // do stuff
  })

// check the condition
const {value} = documentVisibleCondition.run(document.visibilityState)

// the value returned by the first condition matched
// in this case documentVisibilityState === 'visible'
console.log(value)
```


## IfFlow

TODO

## SwitchFlow

TODO

## WhileFlow

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