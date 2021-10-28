const expect = require('chai').expect
const { Puzzle } = require('../../lib/puzzle')
const { nakedPairs } = require('../../lib/strategies')

describe('Naked Pairs Strategy', () => {
  it('should find at least one solution', () => {
    const p = Puzzle.fromSymbols([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ])

    p.cells[0][0].candidates.set(['1', '2'])
    p.cells[0][1].candidates.set(['1', '2'])

    expect(p.applyStrategy(nakedPairs)).to.equal(true)
    expect(p.cells[0][2].candidates.candidates).to.deep.equal(['3', '4'])
    expect(p.cells[0][3].candidates.candidates).to.deep.equal(['3', '4'])
    expect(p.cells[1][0].candidates.candidates).to.deep.equal(['1', '2', '3', '4'])
    expect(p.cells[1][1].candidates.candidates).to.deep.equal(['1', '2', '3', '4'])
  })
})
