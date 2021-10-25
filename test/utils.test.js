/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const { Cell } = require('../lib/cell')
const { getSubsetCellsWith } = require('../lib/strategies/utils')

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

      const results = getSubsetCellsWith({ cells, sharedCandidates: 2, cellCount: 2 })

      expect(results.length).to.equal(1)

      const [result] = results

      expect(result.cells.length).to.equal(2)
      expect(result.candidates).to.deep.equal(['1', '2'])
      expect(result.cells[0].candidates.candidates).to.deep.equal(['1', '2', '3'])
      expect(result.cells[1].candidates.candidates).to.deep.equal(['1', '2', '4'])
    })
  })
})
