import { Cell } from './cell.js'
import _ from 'lodash'

export class PuzzleError extends Error {}

export class ContradictionError extends PuzzleError {
  /**
   * @param {Object} params
   * @param {Puzzle} params.puzzle
   * @param {string} params.region
   * @param {string} params.symbol
   */
  constructor ({ puzzle, region = 'cell group', symbol = 'Entry' }) {
    puzzle.print()
    super(`Symbol '${symbol}' already exists in ${region}`)
  }
}

export class Puzzle {
  /**
   * @param {number} size
   */
  constructor (size = 4) {
    this.size = size
    /** @type {Cell[][]} */
    this.cells = []
    this.init()
  }

  get rank () {
    return Math.sqrt(this.size)
  }

  init () {
    for (let col = 0; col < this.size; col++) {
      this.cells.push([])
      for (let row = 0; row < this.size; row++) {
        this.cells[col][row] = new Cell({ row, col })
      }
    }
  }

  /**
 * @param {string[][]} cells - A 2D array of cell values
 */
  static fromSymbols (cells) {
    const size = cells.length
    const puzzle = new Puzzle(size)
    for (let col = 0; col < size; col++) {
      for (let row = 0; row < size; row++) {
        const value = cells[col][row]
        if (value) {
          puzzle.enterValue({ value, row, col, validate: false })
        }
      }
    }

    puzzle.validate()

    return puzzle
  }

  print () {
    for (const col of this.cells) {
      console.log(col.join(' '))
    }
  }

  rowAt (x) {
    return this.cells[x]
  }

  colAt (y) {
    return this.cells.map(row => row[y])
  }

  boxAt ({ x, y }) {
    const startX = (x * this.rank)
    const startY = (y * this.rank)

    const box = []
    for (let i = 0; i < this.rank; i++) {
      for (let j = 0; j < this.rank; j++) {
        box.push(this.cells[j + startX][i + startY])
      }
    }

    return box
  }

  enterValue ({ value, row, col, validate = true }) {
    this.cells[col][row].enterValue(value)
    if (validate) {
      this.validate()
    }
  }

  /**
   * @param {Cell[]} cells
   */
  validateGroup (cells, region) {
    const solved = cells.filter(cell => cell.hasEntry())
    const duplicates = _.countBy(solved)
    for (const [key, value] of Object.entries(duplicates)) {
      if (value > 1) {
        throw new ContradictionError({ puzzle: this, symbol: key, region })
      }
    }
  }

  validate () {
    // check rows
    for (let i = 0; i < this.size; i++) {
      this.validateGroup(this.rowAt(i), 'row')
    }

    // check columns
    for (let i = 0; i < this.size; i++) {
      this.validateGroup(this.colAt(i), 'column')
    }

    // check boxes
    for (let x = 0; x < this.rank; x++) {
      for (let y = 0; y < this.rank; y++) {
        this.validateGroup(this.boxAt({ x, y }), 'box')
      }
    }
  }

  isSolved () {
    this.validate()
    return this.cells
      .flatMap(row => row)
      .every(cell => cell.hasEntry())
  }
}
