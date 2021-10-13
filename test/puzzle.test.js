const expect = require('chai').expect
const assert = require('assert')
const { Puzzle } = require('../lib/puzzle')

describe('Puzzle', () => {
  describe('#fromSymbols()', () => {
    it('should throw an error with duplicate values in column', () => {
      assert.throws(() => {
        Puzzle.fromSymbols([
          [1, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 0, 0, 0]
        ])
      }, Error)
    })

    it('should throw an error with duplicate values in row', () => {
      assert.throws(() => {
        Puzzle.fromSymbols([
          [1, 0, 0, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ])
      }, Error)
    })

    it('should throw an error with duplicate values in box', () => {
      assert.throws(() => {
        Puzzle.fromSymbols([
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ])
      }, Error)
    })

    it('should create a puzzle', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ])

      assert.ok(p instanceof Puzzle)
    })
  })

  describe('#isSolved', () => {
    it('should not be solved', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ])

      assert.equal(p.isSolved(), false)
    })

    it('should be solved', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [3, 4, 2, 1],
        [2, 1, 4, 3],
        [4, 3, 1, 2]
      ])

      assert.equal(p.isSolved(), true)
    })
  })

  describe('#rowAt', () => {
    it('get the correct rows', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [3, 4, 2, 1],
        [2, 1, 4, 3],
        [4, 3, 1, 2]
      ])

      expect(p.rowAt(0).map(c => c.value)).to.deep.equal(['1', '2', '3', '4'])
      expect(p.rowAt(1).map(c => c.value)).to.deep.equal(['3', '4', '2', '1'])
      expect(p.rowAt(2).map(c => c.value)).to.deep.equal(['2', '1', '4', '3'])
      expect(p.rowAt(3).map(c => c.value)).to.deep.equal(['4', '3', '1', '2'])
    })
  })

  describe('#colAt', () => {
    it('get the correct cols', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [3, 4, 2, 1],
        [2, 1, 4, 3],
        [4, 3, 1, 2]
      ])

      expect(p.colAt(0).map(c => c.value)).to.deep.equal(['1', '3', '2', '4'])
      expect(p.colAt(1).map(c => c.value)).to.deep.equal(['2', '4', '1', '3'])
      expect(p.colAt(2).map(c => c.value)).to.deep.equal(['3', '2', '4', '1'])
      expect(p.colAt(3).map(c => c.value)).to.deep.equal(['4', '1', '3', '2'])
    })
  })

  describe('#boxAt', () => {
    it('get the correct boxes', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [3, 4, 2, 1],
        [2, 1, 4, 3],
        [4, 3, 1, 2]
      ])

      expect(p.rowAt(0).map(c => c.value)).to.deep.equal(['1', '2', '3', '4'])
      expect(p.rowAt(1).map(c => c.value)).to.deep.equal(['3', '4', '2', '1'])
      expect(p.rowAt(2).map(c => c.value)).to.deep.equal(['2', '1', '4', '3'])
      expect(p.rowAt(3).map(c => c.value)).to.deep.equal(['4', '3', '1', '2'])
    })
  })
})
