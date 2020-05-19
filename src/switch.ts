import { AnyValue, MaybeFunction, SwitchFlow } from './types'
import { execMaybeFunction } from './utils'
import ifFlow from './if'

const SWITCH_CONTROL_FLOW_STRUCT = Object.seal<SwitchFlow>({
  value: undefined,
  switchValue: undefined,
  conditionalFlow: ifFlow(),
  fnsStack: [],
  conditionsStack: [],
  case(fn) {
    this.conditionalFlow.elseIf(fn)

    return this
  },
  then(fn) {
    this.conditionalFlow.then(fn)

    return this
  },
  default(fn) {
    this.conditionalFlow.else(fn)

    return this
  },
  run(...args) {
    const testValue = execMaybeFunction(this.switchValue, ...args)
    const index = this.conditionsStack.findIndex(
      fn => execMaybeFunction(fn, ...args) === testValue
    )
    const matchedFn = this.fnsStack[index]

    if (matchedFn) {
      this.value = matchedFn(...args)
    } else if(this.conditionalFlow.fallback) {
      this.value = this.conditionalFlow.fallback(...args)
    }

    return this
  }
})

export default function createSwitchControlFlow<Arguments = AnyValue, Return = AnyValue>(switchValue: MaybeFunction<Arguments, AnyValue>): SwitchFlow<Arguments, Return> {
  const conditionalFlow = ifFlow()

  return {
    ...SWITCH_CONTROL_FLOW_STRUCT,
    conditionalFlow,
    switchValue,
    fnsStack: conditionalFlow.fnsStack,
    conditionsStack: conditionalFlow.conditionsStack
  }
}