import { AnyFunction, AnyValue, IfFlow, MaybeFunction } from './types'
import { createSharedStaticFlowProperties, execMaybeFunction, isUndefined, panic } from './utils'

export default function ifControlFlow(initialCondition?: MaybeFunction): IfFlow {
  return {
    ...createSharedStaticFlowProperties(),
    conditionsStack: isUndefined(initialCondition) ? [] : [initialCondition],
    fallback: null,
    then(fn: AnyFunction): IfFlow {
      if (this.fnsStack.length >= this.conditionsStack.length) {
        panic('There are not enough conditions to handle a new "then" call')
      }

      this.fnsStack.push(fn)

      return this
    },
    elseIf(condition: MaybeFunction): IfFlow {
      if (this.conditionsStack.length !== this.fnsStack.length) {
        panic('Make sure that all the conditions have a "then" callback')
      }

      this.conditionsStack.push(condition)

      return this
    },
    else(fn: AnyFunction): IfFlow {
      if (this.fallback) {
        panic('You can use the "else" and default" statements only once')
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