/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const { Cell } = require('../lib/cell')
const { getSubsetCellsWith, combinations } = require('../lib/strategies/utils')

describe('utils.js', () => {
  describe('#getSubsetCellsWith()', () => {
    it('should find a hidden pair', () => {
      // Only the first and second cell have candidates 1 and 2, making a hidden pair
      const cells = [
        new Cell({ row: 0, col: 0, candidates: ['1', '2', '3'] }),
        new Cell({ row: 0, col: 1, candidates: ['1', '2', '4'] }),
        new Cell({ row: 0, col: 2, candidates: ['5', '6'] }),
        new Cell({ row: 0, col: 3, candidates: ['7', '8'] })
      ]

      const results = [...getSubsetCellsWith({ cells, sharedCandidates: 2, cellCount: 2 })]

      expect(results.length).to.equal(1)

      const [result] = results

      expect(result.cells.length).to.equal(2)
      expect(result.candidates).to.deep.equal(['1', '2'])
      const [cell1, cell2] = result.cells
      expect(cell1.candidates.candidates).to.deep.equal(['1', '2', '3'])
      expect(cell2.candidates.candidates).to.deep.equal(['1', '2', '4'])
    })
  })

  describe('#combinations()', () => {
    it('should return no results when k is 0', () => {
      const combos = [...combinations([1, 2, 3], 0)]
      expect(combos.length).to.equal(0)
    })

    it('should get all combinations of an array when "k" is 2', () => {
      const arr = ['a', 'b', 'c']
      const combos = [...combinations(arr, 2)]

      expect(combos).to.deep.equal([
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'c']
      ])
    })

    it('should get all combinations of an array when "k" is 3', () => {
      const arr = ['a', 'b', 'c', 'd']
      const combos = [...combinations(arr, 3)]

      expect(combos).to.deep.equal([
        ['a', 'b', 'c'],
        ['a', 'b', 'd'],
        ['a', 'c', 'd'],
        ['b', 'c', 'd']
      ])
    })
  })
})
