const EventEmitter = require('events')

class Subscriber {
  /**
   * @param {(message: string) => any} handler
   */
  constructor (handler) {
    if (typeof handler !== 'function') {
      throw new TypeError(`Expected handler to be a function, got ${typeof handler} instead`)
    }

    this._handler = handler
  }

  /**
   * Returns a subscriber with a default handler
   */
  static default () {
    return new Subscriber(console.log)
  }

  receive (...args) {
    return this._handler(...args)
  }
}

class Topic {
  subscriptions () {
    return [...this._subscriptions]
  }

  /**
   * @param {string} name
   */
  constructor (name) {
    /** @private */
    this._name = name

    /**
     * @type {Subscriber[]}
     * @private
     * */
    this._subscriptions = []

    /** @private */
    this._eventEmitter = new EventEmitter()

    this._eventEmitter.on(name, (message) => {
      for (const sub of this._subscriptions) {
        sub.receive(message)
      }
    })

    return new Proxy(this, {
      get (target, prop, receiver) {
        if (prop.startsWith('_')) {
          return
        }

        const value = target[prop]
        if (typeof value === 'function') {
          return value.bind(target)
        }

        return Reflect.get(target, prop, receiver)
      },

      set (obj, prop, value) {
        return false
      }
    })
  }

  /**
   * @param {string} message
   */
  publish (message) {
    this._eventEmitter.emit(this._name, message)
  }

  /**
   * @param {Subscriber} subscriber
   */
  subscribe (subscriber) {
    if (typeof subscriber?.receive !== 'function') {
      throw new TypeError(`Expected subscriber to have a 'receive()' function, got ${typeof subscriber?.receive} instead`)
    }

    this._subscriptions.push(subscriber)
  }

  /**
   * @param {Subscriber} subscriber
   */
  unsubscribe (subscriber) {
    const index = this._subscriptions.findIndex(s => s === subscriber)
    if (index > -1) {
      this._subscriptions.splice(index, 1)
    }
  }
}

module.exports = {
  Topic,
  Subscriber
}
