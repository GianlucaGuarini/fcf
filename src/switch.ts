import { AnyFunction, AnyValue, MaybeFunction, SwitchFlow } from './types'
import { createSharedStaticFlowProperties, execMaybeFunction } from './utils'
import ifFlow from './if'

export default function switchControlFlow(switchValue: MaybeFunction): SwitchFlow {
  const conditionalFlow = ifFlow()

  return {
    ...createSharedStaticFlowProperties(),
    fnsStack: conditionalFlow.fnsStack,
    conditionsStack: conditionalFlow.conditionsStack,
    case(fn: MaybeFunction): SwitchFlow {
      conditionalFlow.elseIf(fn)

      return this
    },
    then(fn: AnyFunction): SwitchFlow {
      conditionalFlow.then(fn)

      return this
    },
    default(fn: AnyFunction): SwitchFlow {
      conditionalFlow.else(fn)

      return this
    },
    run(...args: AnyValue[]): SwitchFlow {
      const testValue = execMaybeFunction(switchValue, ...args)
      const index = this.conditionsStack.findIndex(
        (fn: MaybeFunction) => execMaybeFunction(fn, ...args) === testValue
      )
      const matchedFn = this.fnsStack[index]

      if (matchedFn) {
        this.value = matchedFn(...args)
      } else if(conditionalFlow.fallback) {
        this.value = conditionalFlow.fallback(...args)
      }

      return this
    }
  }
}