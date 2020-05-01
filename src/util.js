import { EventEmitter } from 'events'
import Vue from 'vue'

class Recursive extends EventEmitter {
    constructor(cb = () => null) {
        super()
        this.stoped = false
        this.cb = cb
    }
    start() {
        this.stoped = false
        requestAnimationFrame(async () => await this.loop())
        this.emit('started')

    }
    stop() {
        this.stoped = true
        this.emit('stoped')
    }
    async loop() {
        if (this.stoped) return;
        await this.cb()
        requestAnimationFrame(async () => await this.loop())
    }
}



export const EventBus = new Vue()
export const recursive = (cb) => new Recursive(cb)
export const debounce = (func = () => {}, wait = 500) => {
    let timeout;
    return function () {
        const context = this,
            args = arguments
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null
            func.apply(context, args)
        }, wait);

    }
}
export const throttled = (fn, wait = 500) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall < wait) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
} 
    
export const once = (fn, wait = 500) => {
    let called = false
    let timeout = null
    return function () {
        if (!called) {
            fn.apply(this, arguments)
            called = true
        } 
        if (timeout)
            clearTimeout(timeout)
        timeout = setTimeout(() => called = false, wait)
    }
}   

