const { EventEmitter } = require('events')

/**
 * @typedef {Object} Topic
 * @property {(message: string) => void} publish
 * @property {(fn: function) => boolean} addListener
 * @property {(fn: function) => boolean} removeListener
 */

/**
 * @typedef {Object} Subscriber
 * @property {(topic: Topic, handler: function) => boolean} subscribe
 * @property {(topic: Topic) => boolean} unsubscribe
 * @property {() => any[]} history
 */

/**
 * @param {any} initialState
 * @returns {Subscriber}
 */
exports.Subscriber = (initialState) => {
  const subscriptions = {}
  const states = [initialState]
  return {
    /**
     * @param {Topic} topic
     * @returns {boolean}
     */
    subscribe (topic, handler) {
      if (!subscriptions[topic.name]) {
        subscriptions[topic.name] = (state) => {
          states.push(state)
          return handler(state)
        }

        topic.addListener(subscriptions[topic.name])

        return true
      }

      return false
    },

    /**
     * @param {Topic} topic
     * @returns {boolean}
     */
    unsubscribe (topic) {
      if (subscriptions[topic.name]) {
        topic.removeListener(subscriptions[topic.name])
        delete subscriptions[topic.name]
        return true
      }

      return false
    },

    history (from, to) {
      return [...states]
        .slice(from ?? 0, to ?? states.length)
    }
  }
}

/**
 * @param {string} name
 */
exports.Topic = (name) => {
  const eventEmitter = new EventEmitter()
  return {
    name,

    /**
     * @param {string} message
     */
    publish (message) {
      eventEmitter.emit(name, message)
    },

    /**
     * @private
     * @param {function} listener
     */
    addListener (listener) {
      eventEmitter.on(name, listener)
    },

    /**
     * @param {function} listener
     */
    removeListener (listener) {
      eventEmitter.off(name, listener)
    }
  }
}
