const { Cell } = require('./cell')
const _ = require('lodash')
const { Symbols } = require('./symbols')

class PuzzleError extends Error {}

class ContradictionError extends PuzzleError {
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

class Puzzle {
  /**
   * @param {number} size
   * @param {string[][]} givens
   */
  constructor (size = 4, givens = []) {
    this.size = size
    /** @type {Cell[][]} */
    this.cells = []
    this.symbols = Object.freeze(Symbols[`x${size}`]())

    for (let i = 0; i < this.size; i++) {
      const row = []
      const givensRow = givens[i] ?? []
      for (let j = 0; j < this.size; j++) {
        const value = givensRow[j] ?? null
        const candidates = value ? [] : [...this.symbols]
        const cell = new Cell({
          value,
          row: j,
          col: i,
          candidates
        })

        row.push(cell)
      }

      this.cells.push(row)
    }

    this.validate()
    this.generateCandidates()
  }

  get rank () {
    return Math.sqrt(this.size)
  }

  /**
 * @param {string[][]} cells - A 2D array of cell values
 */
  static fromSymbols (cells) {
    const size = cells.length
    const puzzle = new Puzzle(size, cells)
    // for (let col = 0; col < size; col++) {
    //   for (let row = 0; row < size; row++) {
    //     const value = cells[col][row]
    //     if (value) {
    //       puzzle.enterValue({ value: value.toString(), row, col, validate: false })
    //     }
    //   }
    // }

    return puzzle
  }

  print () {
    for (const col of this.cells) {
      console.log(col.join(' '))
    }
  }

  /**
   * @param {*} strategy
   */
  applyStrategy (strategy) {
    const success = strategy.apply(this)
    // if (success) {
    //   this.generateCandidates()
    // }

    return success
  }

  rowAt (x) {
    return this.cells[x]
  }

  colAt (y) {
    const col = []
    for (const row of this.cells) {
      col.push(row[y])
    }

    return col
  }

  boxAt ({ x, y }) {
    const startX = (x * this.rank)
    const startY = (y * this.rank)

    const box = []
    for (let i = 0; i < this.rank; i++) {
      for (let j = 0; j < this.rank; j++) {
        box.push(this.cells[i + startY][j + startX])
      }
    }

    return box
  }

  rows () {
    return _.range(0, this.size)
      .map(i => this.rowAt(i))
  }

  cols () {
    return _.range(0, this.size)
      .map(i => this.colAt(i))
  }

  boxes () {
    return _.range(0, this.rank)
      .flatMap(x => _.range(0, this.rank).map(y => this.boxAt({ x, y })))
  }

  cellGroups () {
    return [...this.rows(), ...this.cols(), ...this.boxes()]
  }

  enterValue ({ value, row, col, validate = true }) {
    this.cells[col][row].enterValue(value)
    if (validate) {
      this.validate()
    }

    this.generateCandidates()
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

  generateCandidates () {
    // reset candidates
    for (const cell of _.flatten(this.cells)) {
      cell.resetCandidates()
    }

    // remove candidates by row
    for (const group of this.cellGroups()) {
      const [unsolved, solved] = _.partition(group, cell => cell.isEmpty())
      const entries = solved.map(cell => cell.value)
      for (const cell of unsolved) {
        for (const candidate of entries) {
          cell.candidates.remove(candidate)
        }
      }
    }
  }
}

module.exports = {
  Puzzle,
  PuzzleError,
  ContradictionError
}
