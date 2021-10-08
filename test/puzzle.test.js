import assert from 'assert'
import { Puzzle } from '../lib/puzzle.js'

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
})
