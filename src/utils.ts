import { AnyFunction, AnyValue, MaybeFunction } from './types'

/* istanbul ignore next */
export const globalScope = typeof window === 'undefined' ? global : window

export const execMaybeFunction = <Arguments = AnyValue, Return = AnyValue>(fn: MaybeFunction<Arguments, Return>, ...args: Arguments[]): AnyValue => {
  return typeof fn === 'function' ? fn(...args) : fn
}

export const isUndefined = (value: AnyValue): boolean => typeof value === 'undefined'

export const panic = (message: string): void => {
  throw new Error(message)
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
        start: setImmediate.bind(global),
        end: clearImmediate.bind(global)
      }
    : {
      start: requestAnimationFrame.bind(window),
      end: cancelAnimationFrame.bind(window)
    }