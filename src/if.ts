import { AnyFunction, AnyValue, IfFlow, MaybeFunction } from './types'
import { CONDITION_STACK_INSUFFICENT_ERROR, FN_STACK_OVERFLOW_ERROR, MULTIPLE_FALLBACK_FN_ERROR } from './constants'
import { createSharedStaticFlowProperties, execMaybeFunction, isUndefined, panic } from './utils'

export default function ifControlFlow(initialCondition?: MaybeFunction): IfFlow {
  return {
    ...createSharedStaticFlowProperties(),
    conditionsStack: isUndefined(initialCondition) ? [] : [initialCondition],
    fallback: null,
    then(fn: AnyFunction): IfFlow {
      if (this.fnsStack.length >= this.conditionsStack.length) {
        panic(FN_STACK_OVERFLOW_ERROR)
      }

      this.fnsStack.push(fn)

      return this
    },
    elseIf(condition: MaybeFunction): IfFlow {
      if (this.conditionsStack.length > this.fnsStack.length) {
        panic(CONDITION_STACK_INSUFFICENT_ERROR)
      }

      this.conditionsStack.push(condition)

      return this
    },
    else(fn: AnyFunction): IfFlow {
      if (this.fallback) {
        panic(MULTIPLE_FALLBACK_FN_ERROR)
      }

      this.fallback = fn

      return this
    },
    run(...args: AnyValue[]): IfFlow {
      const index = this.conditionsStack.findIndex((fn: MaybeFunction) => execMaybeFunction(fn, ...args))
      const matchedFn = this.fnsStack[index]

      if (matchedFn) {
        this.value = matchedFn(...args)
      } else if(this.fallback) {
        this.value = this.fallback(...args)
      }

      return this
    }
  }
}