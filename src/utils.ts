import { AnyFunction, AnyValue, MaybeFunction } from './types'

/* istanbul ignore next */
export const globalScope = typeof window === 'undefined' ? global : window

export function execMaybeFunction(fn: MaybeFunction, ...args: AnyValue[]): AnyValue {
  return typeof fn === 'function' ? fn(...args) : fn
}

export function isUndefined(value: AnyValue): boolean {
  return typeof value === 'undefined'
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