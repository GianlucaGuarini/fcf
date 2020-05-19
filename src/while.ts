import { AnyFunction, AnyValue, MaybeFunction, WhileFlow } from './types'
import { MULTIPLE_BREAK_LOOP_CALLS_ERROR, MULTIPLE_RUN_CALLS_ERROR } from './constants'
import { execMaybeFunction, loopingFns, panic } from './utils'

const loop: (
  scope: WhileFlow,
  controlFunction: MaybeFunction,
  ...args: AnyValue[]
) => void = (scope, controlFunction, ...args) => {
  scope.timer = loopingFns.start(() => {
    scope.value = execMaybeFunction(controlFunction, ...args)
    // stop the loop if any of the function will return false
    if (scope.value && scope.fnsStack.every(fn => fn(...args) !== false)) {
      loop(scope, controlFunction, ...args)
    }
  })
}

const WHILE_CONTROL_FLOW_STRUCT = Object.seal<WhileFlow>({
  value: undefined,
  timer: undefined,
  fnsStack: [],
  controlFunction: undefined,
  isLooping: false,
  break(fn?: AnyFunction): WhileFlow {
    if (this.isLooping) {
      loopingFns.end(this.timer)
      this.isLooping = false
      if (fn) fn()
    } else {
      panic(MULTIPLE_BREAK_LOOP_CALLS_ERROR)
    }

    return this
  },
  do(fn: AnyFunction): WhileFlow {
    this.fnsStack.push(fn)

    return this
  },
  run(...args: AnyValue[]): WhileFlow  {
    if (this.isLooping) {
      panic(MULTIPLE_RUN_CALLS_ERROR)
    }

    this.isLooping = true

    loop(this, this.controlFunction, ...args)

    return this
  }
})

export default function createWhileControlFlow(controlFunction: MaybeFunction): WhileFlow {
  return {
    ...WHILE_CONTROL_FLOW_STRUCT,
    controlFunction
  }
}