// general types
import FCF from './index'

export type AnyValue = any // eslint-disable-line
export type AnyFunction<Arguments = AnyValue, Return = AnyValue> = (...args: Arguments[]) => Return
export type MaybeFunction<Arguments, Return> = AnyValue | AnyFunction<Arguments, Return>

export interface ConditionalFlow<Value = AnyValue> {
  private fnsStack: AnyFunction[];
  private conditionsStack: MaybeFunction[];
  value: Value;
}

export interface IfFlow<Arguments = AnyValue, Return = AnyValue> extends ConditionalFlow<Return> {
  private fallback?: AnyFunction;
  else: (fn: AnyFunction<Arguments, AnyValue>) => IfFlow;
  elseIf: (fn: MaybeFunction<Arguments, AnyValue>) => IfFlow;
  then: (fn: AnyFunction<Arguments, Return>) => IfFlow;
  run: (...args: Arguments[]) => IfFlow;
}

export interface SwitchFlow<Arguments = AnyValue, Return = AnyValue> extends ConditionalFlow<Return> {
  private conditionalFlow: IfFlow;
  private switchValue: T;
  case: (fn: MaybeFunction<Arguments, AnyValue>) => SwitchFlow;
  default: (fn: AnyFunction<Arguments, Return>) => SwitchFlow;
  then: (fn: AnyFunction<Arguments, Return>) => SwitchFlow;
  run: (...args: Arguments[]) => SwitchFlow;
}

export interface WhileFlow<Arguments = AnyValue, Return = AnyValue> {
  private fnsStack: AnyFunction[];
  private isLooping: boolean;
  private timer: AnyValue;
  private controlFunction: MaybeFunction<Arguments, Return>;
  value: Return;
  break: (fn?: AnyFunction<Arguments, AnyValue>) => WhileFlow;
  do: (fn: AnyFunction<Arguments, Return>) => WhileFlow;
  run: (...args: Arguments[]) => WhileFlow;
}

declare module 'fcf' {
  export default FCF
}