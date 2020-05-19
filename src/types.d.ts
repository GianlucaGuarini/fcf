// general types
import FCF from './index'

export type AnyValue = any // eslint-disable-line
export type AnyFunction<Arguments = AnyValue, Return = Arguments> = (...args: Arguments[]) => Return
export type MaybeFunction = AnyValue | AnyFunction

export interface ConditionalFlow {
  private fnsStack: AnyFunction[];
  private conditionsStack: MaybeFunction[];
  value: AnyValue;
}

export interface IfFlow<Arguments = AnyValue, Return = Arguments> extends ConditionalFlow {
  private fallback?: AnyFunction;
  else: (fn: AnyFunction<Arguments, Return>) => IfFlow;
  elseIf: (fn: MaybeFunction<Arguments, Return>) => IfFlow;
  then: (fn: AnyFunction<Arguments, Return>) => IfFlow;
  run: (...args: T[]) => IfFlow;
}

export interface SwitchFlow<Arguments = AnyValue, Return = Arguments> extends ConditionalFlow {
  private conditionalFlow: IfFlow;
  private switchValue: T;
  default: (fn: AnyFunction<Arguments, Return>) => SwitchFlow;
  case: (fn: MaybeFunction<Arguments, Return>) => SwitchFlow;
  then: (fn: AnyFunction<Arguments, Return>) => SwitchFlow;
  run: (...args: T[]) => SwitchFlow;
}

export interface WhileFlow<Arguments = AnyValue, Return = Arguments> {
  private fnsStack: AnyFunction[];
  private isLooping: boolean;
  private timer: AnyValue;
  private controlFunction: MaybeFunction;
  value: AnyValue;
  break: (fn?: AnyFunction<Arguments, Return>) => WhileFlow;
  do: (fn: AnyFunction<Arguments, Return>) => WhileFlow;
  run: (...args: T[]) => WhileFlow;
}

declare module 'fcf' {
  export default FCF
}