import { AnyFunction, AnyValue, MaybeFunction } from './types'

/* istanbul ignore next */
export const globalScope = typeof window === 'undefined' ? global : window

export const execMaybeFunction = (fn: MaybeFunction, ...args: AnyValue[]): AnyValue => {
  return typeof fn === 'function' ? fn(...args) : fn
}

export const isUndefined = (value: AnyValue): boolean => typeof value === 'undefined'

export const panic = (message: string): void => {
  throw new Error(message)
}

export const createSharedStaticFlowProperties = (): {
  value: undefined;
  fnsStack: AnyFunction[];
} => {
  return {
    value: undefined,
    fnsStack: []
  }
}

/* istanbul ignore next */
export const loopingFns: {start: (fn: AnyFunction) => void; end: (timer: AnyValue) => void } =
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore: this code can run in browsers and in node
  isUndefined(globalScope.requestAnimationFrame) ?
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
    isUndefined(globalScope.setImmediate) ?

      {
        start: (fn: AnyFunction): AnyValue => setTimeout(fn, 1),
        end: clearTimeout
      }
      : {
        start: setImmediate,
        end: clearImmediate
      }
    : {
      start: requestAnimationFrame,
      end: cancelAnimationFrame
    }