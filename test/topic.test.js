/* eslint-disable no-unused-expressions */
const spies = require('chai-spies')
const chai = require('chai')
const { expect } = chai
const { Topic, Subscriber } = require('../lib/events')

chai.use(spies)

describe('Topic', () => {
  describe('#publish()', () => {
    it('should publish a message to multiple consumers', () => {
      const topic = new Topic('foo')
      const sub1 = Subscriber.default()
      const sub2 = Subscriber.default()

      const spy1 = chai.spy.on(sub1, 'receive')
      const spy2 = chai.spy.on(sub2, 'receive')

      topic.subscribe(sub1)
      topic.subscribe(sub2)

      topic.publish('test')
      expect(spy1).to.have.been.called.with('test')
      expect(spy2).to.have.been.called.with('test')
    })
  })

  describe('#unsubscribe()', () => {
    it('should unsubscribe a subscriber', () => {
      const topic = new Topic('foo')
      const sub = Subscriber.default()
      const spy = chai.spy.on(sub, 'receive')
      topic.subscribe(sub)
      topic.publish('test')
      topic.unsubscribe(sub)
      topic.publish('test2')

      expect(spy).to.have.been.called.exactly(1)
    })
  })

  describe('#subscribe', () => {
    it('should subscribe a subscriber', () => {
      const topic = new Topic('foo')
      const sub = Subscriber.default()
      topic.subscribe(sub)
      expect(topic.subscriptions().includes(sub)).to.be.true
    })

    it('should only subscribe objects of type Subscription', () => {
      const topic = new Topic('foo')
      expect(() => topic.subscribe({ recieve () {} })).to.throw(TypeError)
      expect(() => topic.subscribe({})).to.throw(TypeError)
      expect(() => topic.subscribe(undefined)).to.throw(TypeError)
    })
  })
})
