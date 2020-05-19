// general types
export type AnyValue = any // eslint-disable-line
export type AnyFunction<Return = AnyValue> = (...args: AnyValue[]) => Return
export type MaybeFunction = AnyValue | AnyFunction

export interface ConditionalFlow {
  private fnsStack: AnyFunction[];
  private conditionsStack: MaybeFunction[];
  value: AnyValue;
}

export interface IfFlow extends ConditionalFlow {
  private fallback?: AnyFunction;
  else: (fn: AnyFunction) => IfFlow;
  elseIf: (fn: MaybeFunction) => IfFlow;
  then: (fn: AnyFunction) => IfFlow;
  run: (...args: AnyValue[]) => IfFlow;
}

export interface SwitchFlow extends ConditionalFlow {
  private conditionalFlow: IfFlow;
  private switchValue: AnyValue;
  default: (fn: AnyFunction) => SwitchFlow;
  case: (fn: MaybeFunction) => SwitchFlow;
  then: (fn: AnyFunction) => SwitchFlow;
  run: (...args: AnyValue[]) => SwitchFlow;
}

export interface WhileFlow {
  private fnsStack: AnyFunction[];
  private isLooping: boolean;
  private timer: AnyValue;
  private controlFunction: MaybeFunction;
  value: AnyValue;
  break: (fn?: AnyFunction) => WhileFlow;
  do: (fn: AnyFunction) => WhileFlow;
  run: (...args: AnyValue[]) => WhileFlow;
}

declare module 'fcf' {
  export interface FCF {
    if: (initialCondition?: MaybeFunction) => IfFlow;
    switch: (switchValue: MaybeFunction) => SwitchFlow;
    while: (controlFunction: MaybeFunction) => WhileFlow;
  }
}