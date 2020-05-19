import { AnyFunction, AnyValue, MaybeFunction, SwitchFlow } from './types'
import { execMaybeFunction } from './utils'
import ifFlow from './if'

const SWITCH_CONTROL_FLOW_STRUCT = Object.seal<SwitchFlow>({
  value: undefined,
  switchValue: undefined,
  conditionalFlow: ifFlow(),
  fnsStack: [],
  conditionsStack: [],
  case(fn: MaybeFunction): SwitchFlow {
    this.conditionalFlow.elseIf(fn)

    return this
  },
  then(fn: AnyFunction): SwitchFlow {
    this.conditionalFlow.then(fn)

    return this
  },
  default(fn: AnyFunction): SwitchFlow {
    this.conditionalFlow.else(fn)

    return this
  },
  run(...args: AnyValue[]): SwitchFlow {
    const testValue = execMaybeFunction(this.switchValue, ...args)
    const index = this.conditionsStack.findIndex(
      (fn: MaybeFunction) => execMaybeFunction(fn, ...args) === testValue
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

export default function createSwitchControlFlow(switchValue: MaybeFunction): SwitchFlow {
  const conditionalFlow = ifFlow()

  return {
    ...SWITCH_CONTROL_FLOW_STRUCT,
    conditionalFlow,
    switchValue,
    fnsStack: conditionalFlow.fnsStack,
    conditionsStack: conditionalFlow.conditionsStack
  }
}