/* eslint-disable no-unused-expressions */
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
          [1, 0, 0, 0],
        ])
      }, Error)
    })

    it('should throw an error with duplicate values in row', () => {
      assert.throws(() => {
        Puzzle.fromSymbols([
          [1, 0, 0, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ])
      }, Error)
    })

    it('should throw an error with duplicate values in box', () => {
      assert.throws(() => {
        Puzzle.fromSymbols([
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ])
      }, Error)
    })

    it('should create a puzzle', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
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
        [0, 0, 0, 0],
      ])

      assert.equal(p.isSolved(), false)
    })

    it('should be solved', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [3, 4, 2, 1],
        [2, 1, 4, 3],
        [4, 3, 1, 2],
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
        [4, 3, 1, 2],
      ])

      expect(p.rowAt(0).map((c) => c.value)).to.deep.equal(['1', '2', '3', '4'])
      expect(p.rowAt(1).map((c) => c.value)).to.deep.equal(['3', '4', '2', '1'])
      expect(p.rowAt(2).map((c) => c.value)).to.deep.equal(['2', '1', '4', '3'])
      expect(p.rowAt(3).map((c) => c.value)).to.deep.equal(['4', '3', '1', '2'])
    })

    it('should return a reference to cells in the puzzle', () => {
      const p = Puzzle.fromSymbols([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])

      expect(p.cells[0][0].value === null).to.be.true
      const row = p.rowAt(0)
      row[0].enterValue('1')
      expect(row[0].value === '1').to.be.true
      expect(p.cells[0][0].value === '1').to.be.true
    })
  })

  describe('#colAt', () => {
    it('get the correct cols', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [3, 4, 2, 1],
        [2, 1, 4, 3],
        [4, 3, 1, 2],
      ])

      expect(p.colAt(0).map((c) => c.value)).to.deep.equal(['1', '3', '2', '4'])
      expect(p.colAt(1).map((c) => c.value)).to.deep.equal(['2', '4', '1', '3'])
      expect(p.colAt(2).map((c) => c.value)).to.deep.equal(['3', '2', '4', '1'])
      expect(p.colAt(3).map((c) => c.value)).to.deep.equal(['4', '1', '3', '2'])
    })

    it('should return a reference to cells in the puzzle', () => {
      const p = Puzzle.fromSymbols([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])

      expect(p.cells[0][0].value === null).to.be.true
      const col = p.colAt(3)
      col[3].enterValue('1')
      expect(col[3].value === '1').to.be.true
      expect(p.cells[3][3].value === '1').to.be.true
    })
  })

  describe('#boxAt', () => {
    it('get the correct boxes', () => {
      const p = Puzzle.fromSymbols([
        [1, 2, 3, 4],
        [3, 4, 2, 1],
        [2, 1, 4, 3],
        [4, 3, 1, 2],
      ])

      // expect(p.boxAt({ x: 0, y: 0 }).map(c => c.value)).to.deep.equal(['1', '2', '3', '4'])
      // expect(p.boxAt({ x: 1, y: 0 }).map(c => c.value)).to.deep.equal(['3', '4', '2', '1'])
      // expect(p.boxAt({ x: 0, y: 1 }).map(c => c.value)).to.deep.equal(['2', '1', '4', '3'])
      // expect(p.boxAt({ x: 1, y: 1 }).map(c => c.value)).to.deep.equal(['4', '3', '1', '2'])
      const box1 = p.boxAt({ x: 0, y: 0 })
      expect(box1[0].position.equals({ col: 0, row: 0 }))
      expect(box1[0].position.equals({ col: 1, row: 0 }))
      expect(box1[0].position.equals({ col: 0, row: 1 }))
      expect(box1[0].position.equals({ col: 1, row: 1 }))

      const box2 = p.boxAt({ x: 1, y: 0 })
      expect(box2[0].position.equals({ col: 0, row: 0 }))
      expect(box2[0].position.equals({ col: 1, row: 0 }))
      expect(box2[0].position.equals({ col: 0, row: 1 }))
      expect(box2[0].position.equals({ col: 1, row: 1 }))

      const box3 = p.boxAt({ x: 0, y: 1 })
      expect(box3[0].position.equals({ col: 0, row: 2 }))
      expect(box3[0].position.equals({ col: 1, row: 2 }))
      expect(box3[0].position.equals({ col: 0, row: 3 }))
      expect(box3[0].position.equals({ col: 1, row: 3 }))

      const box4 = p.boxAt({ x: 1, y: 1 })
      expect(box4[0].position.equals({ col: 2, row: 2 }))
      expect(box4[0].position.equals({ col: 3, row: 2 }))
      expect(box4[0].position.equals({ col: 2, row: 4 }))
      expect(box4[0].position.equals({ col: 3, row: 4 }))
    })

    it('should return a reference to cells in the puzzle', () => {
      const p = Puzzle.fromSymbols([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])

      expect(p.cells[2][0].value === null).to.be.true
      const box = p.boxAt({ x: 0, y: 1 })
      box[0].enterValue('1')
      expect(box[0].value === '1').to.be.true
      expect(p.cells[2][0].value === '1').to.be.true
    })
  })
})
