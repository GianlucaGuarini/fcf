import { AnyValue, IfFlow, MaybeFunction } from './types'
import { CONDITION_STACK_INSUFFICENT_ERROR, FN_STACK_OVERFLOW_ERROR, MULTIPLE_FALLBACK_FN_ERROR } from './constants'
import { execMaybeFunction, isUndefined, panic } from './utils'

const IF_CONTROL_FLOW_STRUCT = Object.seal<IfFlow<AnyValue[]>>({
  value: undefined,
  fallback: undefined,
  fnsStack: [],
  conditionsStack: [],
  then(fn) {
    if (this.fnsStack.length >= this.conditionsStack.length) {
      panic(FN_STACK_OVERFLOW_ERROR)
    }

    this.fnsStack.push(fn)

    return this
  },
  elseIf(condition) {
    if (this.conditionsStack.length > this.fnsStack.length) {
      panic(CONDITION_STACK_INSUFFICENT_ERROR)
    }

    this.conditionsStack.push(condition)

    return this
  },
  else(fn) {
    if (this.fallback) {
      panic(MULTIPLE_FALLBACK_FN_ERROR)
    }

    this.fallback = fn

    return this
  },
  run(...args) {
    const index = this.conditionsStack.findIndex(fn => execMaybeFunction(fn, ...args))
    const matchedFn = this.fnsStack[index]

    if (matchedFn) {
      this.value = matchedFn(...args)
    } else if(this.fallback) {
      this.value = this.fallback(...args)
    }

    return this
  }
})

export default function createIfControlFlow<Arguments extends AnyValue[], Return = AnyValue, InitialCondition = MaybeFunction<Arguments, AnyValue, AnyValue>>(initialCondition?: InitialCondition): IfFlow<Arguments, Return> {
  return {
    ...IF_CONTROL_FLOW_STRUCT,
    fnsStack: [],
    conditionsStack: isUndefined(initialCondition) ? [] : [initialCondition]
  }
}
