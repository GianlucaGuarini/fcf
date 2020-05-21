// general types
import FCF from './index'

export type AnyValue = any // eslint-disable-line
export type AnyFunction<Arguments extends AnyValue[], Return = AnyValue> = (...args: Arguments) => Return
export type MaybeFunction<Arguments extends AnyValue[], Return = AnyValue, T extends AnyValue> = T | AnyFunction<Arguments, Return>

export interface ConditionalFlow<Arguments extends AnyValue[], FlowValue = AnyValue> {
  private fnsStack: AnyFunction<Arguments, FlowValue>[];
  private conditionsStack: MaybeFunction<Arguments>[];
  value: FlowValue;
}

export interface IfFlow<Arguments extends AnyValue[], FlowValue = AnyValue> extends ConditionalFlow<Arguments, FlowValue> {
  private fallback?: AnyFunction<Arguments, FlowValue>;
  else: (fn: AnyFunction<Arguments>) => IfFlow<Arguments, FlowValue>;
  elseIf: <T>(fn: MaybeFunction<Arguments, AnyValue, T>) => IfFlow<Arguments, FlowValue>;
  then: (fn: AnyFunction<Arguments, FlowValue>) => IfFlow<Arguments, FlowValue>;
  run: (...args: Arguments) => IfFlow<Arguments, FlowValue>;
}

export interface SwitchFlow<Arguments extends AnyValue[], FlowValue = AnyValue> extends ConditionalFlow<Arguments, FlowValue> {
  private conditionalFlow: IfFlow<Arguments, FlowValue>;
  private switchValue: AnyValue;
  case: <T>(fn: MaybeFunction<Arguments, AnyValue, T>) => SwitchFlow<Arguments, FlowValue>;
  default: (fn: AnyFunction<Arguments, FlowValue>) => SwitchFlow<Arguments, FlowValue>;
  then: (fn: AnyFunction<Arguments, FlowValue>) => SwitchFlow<Arguments, FlowValue>;
  run: (...args: Arguments) => SwitchFlow<Arguments, FlowValue>;
}

export interface WhileFlow<Arguments extends AnyValue[], FlowValue = AnyValue> {
  private fnsStack: AnyFunction<Arguments, FlowValue>[];
  private isLooping: boolean;
  private timer: AnyValue;
  private controlFunction: MaybeFunction<Arguments, FlowValue>;
  value: FlowValue;
  break: (fn?: AnyFunction<Arguments>) => WhileFlow<Arguments, FlowValue>;
  do: (fn: AnyFunction<Arguments, FlowValue>) => WhileFlow<Arguments, FlowValue>;
  run: (...args: Arguments) => WhileFlow<Arguments, FlowValue>;
}

declare module 'fcf' {
  export default FCF
}
