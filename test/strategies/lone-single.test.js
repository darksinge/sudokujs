const assert = require('assert')
const { Puzzle } = require('../../lib/puzzle')
const { loneSingle } = require('../../lib/strategies')

describe('Long Single Strategy', () => {
  it('should be enough to solve a simple puzzle', () => {
    const p = Puzzle.fromSymbols([
      [1, 0, 0, 0],
      [0, 2, 0, 0],
      [0, 3, 4, 0],
      [0, 0, 0, 3]
    ])

    assert.equal(p.isSolved(), false)

    while (p.applyStrategy(loneSingle)) {
      /** noop */
    }

    assert.equal(p.isSolved(), true)
    p.print()
  })
})
