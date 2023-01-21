const expect = require('chai').expect
const { Puzzle } = require('../../lib/puzzle')
const { hiddenPairs } = require('../../lib/strategies')

describe('Naked Pairs Strategy', () => {
  it('should find at least one solution', () => {
    const p = Puzzle.fromSymbols([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])

    p.cells[0][0].candidates.set(['1', '2', '3'])
    p.cells[0][1].candidates.set(['1', '2', '4'])
    p.cells[0][2].candidates.set(['4', '5'])
    p.cells[0][3].candidates.set(['6', '7'])

    expect(p.applyStrategy(hiddenPairs)).to.equal(true)
    expect(p.cells[0][0].candidates.candidates).to.deep.equal(['1', '2'])
    expect(p.cells[0][1].candidates.candidates).to.deep.equal(['1', '2'])

    p.print()
  })
})
