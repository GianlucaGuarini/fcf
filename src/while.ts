import { AnyFunction, AnyValue, WhileFlow } from './types'
import { loopingFns } from './utils'

export default function whileControlFlow(controlFunction: AnyFunction): WhileFlow {
  return {
    fnsStack: [],
    timer: undefined,
    isLooping: false,
    break(fn?: AnyFunction): WhileFlow {
      if (this.isLooping) {
        loopingFns.end(this.timer)
        this.isLooping = false
        if (fn) fn()
      }

      return this
    },
    do(fn: AnyFunction): WhileFlow {
      this.fnsStack.push(fn)

      return this
    },
    run(...args: AnyValue[]): WhileFlow  {
      if (this.isLooping) {
        return this
      }

      this.isLooping = true

      const loop: () => void = () => {
        this.timer = loopingFns.start(() => {
          // stop the loop if any of the function will return false
          if (controlFunction(...args) && this.fnsStack.every(fn => fn(...args) !== false)) {
            loop()
          }
        })
      }

      loop()

      return this
    }
  }
}