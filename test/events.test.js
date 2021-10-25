/* eslint-disable no-unused-expressions */
const spies = require('chai-spies')
const chai = require('chai')
const { expect } = chai
const { Topic, Subscriber } = require('../lib/events')

chai.use(spies)

describe('Events', () => {
  describe('Topic', () => {
    describe('#publish()', () => {
      it('should publish a message to multiple consumers', () => {
        const topic = Topic('foo')
        const sub1 = Subscriber()
        const sub2 = Subscriber()

        const spy1 = chai.spy()
        sub1.subscribe(topic, spy1)
        const spy2 = chai.spy()
        sub2.subscribe(topic, spy2)

        topic.publish('test')
        expect(spy1).to.have.been.called.with('test')
        expect(spy2).to.have.been.called.with('test')
      })

      it('should publish many messages to many consumers', () => {
        const t1 = Topic('foo')
        const t2 = Topic('bar')
        const sub1 = Subscriber()
        const sub2 = Subscriber()
        const sub3 = Subscriber()

        const spy1 = chai.spy()
        sub1.subscribe(t1, spy1)
        sub2.subscribe(t1, spy1)

        const spy2 = chai.spy()
        sub2.subscribe(t2, spy2)
        sub3.subscribe(t2, spy2)

        t1.publish('foo')
        t2.publish('foo')

        expect(spy1).to.have.been.called.twice
        expect(spy2).to.have.been.called.twice
      })
    })
  })

  describe('Subscriber', () => {
    describe('#unsubscribe()', () => {
      it('should unsubscribe a subscriber', () => {
        const topic = Topic('foo')
        const sub = Subscriber()
        const spy = chai.spy()
        sub.subscribe(topic, spy)
        topic.publish('test1')
        sub.unsubscribe(topic)
        topic.publish('test2')

        expect(spy).to.have.been.called.exactly(1).with('test1')
      })
    })
  })
})
