const expect = require('chai').expect
const { Candidates } = require('../lib/candidates')

describe('Candidates', () => {
  describe('#constructor()', () => {
    it('should construct a Candidates object', () => {
      const c = new Candidates(['1', '2', '3', '4'])
      expect(c.candidates).to.deep.equal(['1', '2', '3', '4'])
    })
  })

  describe('#add()', () => {
    it('should add a candidate', () => {
      const c = new Candidates(['1', '2', '3'])
      expect(c.candidates).to.deep.equal(['1', '2', '3'])
      c.add('4')
      expect(c.candidates).to.deep.equal(['1', '2', '3', '4'])
    })

    describe('#remove()', () => {
      it('should remove a candidate', () => {
        const c = new Candidates(['1', '2', '3'])
        expect(c.candidates).to.deep.equal(['1', '2', '3'])
        expect(c.remove('3')).to.equal(true)
        expect(c.candidates).to.deep.equal(['1', '2'])
      })

      it('should not remove a candidate', () => {
        const c = new Candidates(['1', '2', '3'])
        expect(c.candidates).to.deep.equal(['1', '2', '3'])
        expect(c.remove('4')).to.equal(false)
        expect(c.candidates).to.deep.equal(['1', '2', '3'])
      })
    })

    describe('#has()', () => {
      it('should have a candidate', () => {
        const c = new Candidates(['1', '2', '3'])
        expect(c.has('1')).to.equal(true)
      })

      it('should not have a candidate', () => {
        const c = new Candidates(['1', '2', '3'])
        expect(c.has('4')).to.equal(false)
      })
    })

    describe('#sort()', () => {
      it('should sort candidates', () => {
        const c = new Candidates(['3', '2', '1'])
        expect(c.candidates).to.deep.equal(['3', '2', '1'])
        c.remove('2')
        expect(c.candidates).to.deep.equal(['3', '1'])
        c.add('2')
        expect(c.candidates).to.deep.equal(['3', '1', '2'])
        c.sort()
        expect(c.candidates).to.deep.equal(['1', '2', '3'])
      })
    })

    describe('#clear()', () => {
      it('should clear all candidates', () => {
        const c = new Candidates(['3', '2', '1'])
        expect(c.candidates).to.deep.equal(['3', '2', '1'])
        c.clear()
        expect(c.candidates).to.deep.equal([])
      })
    })
  })
})
