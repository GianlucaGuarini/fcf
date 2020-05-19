import { AnyFunction, AnyValue, WhileFlow } from './types'
import { createSharedStaticFlowProperties, loopingFns, panic } from './utils'

export default function whileControlFlow(controlFunction: AnyFunction): WhileFlow {
  return {
    ...createSharedStaticFlowProperties(),
    timer: undefined,
    isLooping: false,
    break(fn?: AnyFunction): WhileFlow {
      if (this.isLooping) {
        loopingFns.end(this.timer)
        this.isLooping = false
        if (fn) fn()
      } else {
        panic('You can not break a while loop that was never started')
      }

      return this
    },
    do(fn: AnyFunction): WhileFlow {
      this.fnsStack.push(fn)

      return this
    },
    run(...args: AnyValue[]): WhileFlow  {
      if (this.isLooping) {
        panic('This while loop is still running, you can not run it twice')
      }

      this.isLooping = true

      const loop: () => void = () => {
        this.timer = loopingFns.start(() => {
          this.value = controlFunction(...args)
          // stop the loop if any of the function will return false
          if (this.value && this.fnsStack.every(fn => fn(...args) !== false)) {
            loop()
          }
        })
      }

      loop()

      return this
    }
  }
}