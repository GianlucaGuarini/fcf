// general types
export type AnyValue = any // eslint-disable-line
export type AnyFunction<Return = AnyValue> = (...args: AnyValue[]) => Return
export type MaybeFunction = AnyValue | AnyFunction

export interface ConditionalFlow {
  fnsStack: AnyFunction[];
  conditionsStack: MaybeFunction[];
  value: AnyValue;
}

export interface IfFlow extends ConditionalFlow {
  fallback: null | AnyFunction;
  else: (fn: AnyFunction) => IfFlow;
  elseIf: (fn: MaybeFunction) => IfFlow;
  then: (fn: AnyFunction) => IfFlow;
  run: (...args: AnyValue[]) => IfFlow;
}

export interface SwitchFlow extends ConditionalFlow {
  default: (fn: AnyFunction) => SwitchFlow;
  case: (fn: MaybeFunction) => SwitchFlow;
  then: (fn: AnyFunction) => SwitchFlow;
  run: (...args: AnyValue[]) => SwitchFlow;
}

export interface WhileFlow {
  fnsStack: AnyFunction[];
  value: AnyValue;
  isLooping: boolean;
  timer: AnyValue;
  break: (fn?: AnyFunction) => WhileFlow;
  do: (fn: AnyFunction) => WhileFlow;
  run: (...args: AnyValue[]) => WhileFlow;
}
