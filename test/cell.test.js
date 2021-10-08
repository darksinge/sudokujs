const assert = require('assert')
const { Cell, InvalidCoordinates, InvalidEntryError } = require('../lib/cell')
const { symbols } = require('../lib/symbols')

describe('Cell', () => {
  describe('#constructor()', () => {
    it('should throw an error if using an invalid value', () => {
      assert.throws(() => new Cell({ value: '%', row: 0, col: 0 }), InvalidEntryError)
      assert.throws(() => new Cell({ value: -1, row: 0, col: 0 }), InvalidEntryError)
      assert.throws(() => new Cell({ value: '0', row: 0, col: 0 }), InvalidEntryError)
    })

    it('should be happy as a clam', () => {
      for (const value of symbols) {
        assert.ok(new Cell({ value, row: 0, col: 0 }) instanceof Cell)
      }
    })

    it('should treat 0 as an empty value', () => {
      const cell = new Cell({ value: 0, row: 0, col: 0 })
      assert.equal(cell.value, null)
      assert.ok(cell.isEmpty())
    })

    it('should have an entry', () => {
      const cell = new Cell({ value: 1, row: 0, col: 0 })
      assert.equal(cell.value, '1')
      assert.ok(!cell.isEmpty())
    })

    it('should throw an error if using invalid coordinates', () => {
      assert.throws(() => new Cell({ row: '^', col: 1 }), InvalidCoordinates)
      assert.throws(() => new Cell({ row: 0, col: -1 }), InvalidCoordinates)
      assert.throws(() => new Cell({ row: Number.POSITIVE_INFINITY, col: 0 }), InvalidCoordinates)
      assert.throws(() => new Cell({ row: NaN, col: 0 }), InvalidCoordinates)
    })
  })
})
