const _ = require('lodash')
const { Symbols } = require('./symbols')

const symbols = Symbols.x4()

class CellError extends Error {}

class InvalidEntryError extends CellError {
  /**
   * @param {string} symbol
   */
  constructor (symbol) {
    // TODO: This validation needs to be moved to Puzzle
    super(`'${symbol}' is not a valid symbol`)
  }
}

class InvalidCoordinates extends CellError {
  /**
   * @param {Cell} cell
   */
  constructor (cell) {
    super(`Invalid coordinates: (row=${cell.row}, col=${cell.col})`)
  }
}

class Cell {
/**
 * @param {Object} params
 * @param {string} params.value
 * @param {number} params.row
 * @param {number} params.col
 */
  constructor ({ value = null, row, col }) {
    this.row = row
    this.col = col
    this.value = value
    this.init()
  }

  init () {
    const isFinite = _.isFinite(this.row) && _.isFinite(this.col)
    const isPositive = this.row >= 0 && this.col >= 0
    if (!isFinite || !isPositive) {
      throw new InvalidCoordinates(this)
    }

    this.enterValue(this.value)
  }

  toString () {
    return this.value || Symbols.empty
  }

  /**
 * @param {string} value
 */
  enterValue (value) {
    if (!value || value === Symbols.empty) {
      this.value = null
    } else if (!symbols.includes(`${value}`)) {
      throw new InvalidEntryError(value)
    } else {
      this.value = `${value}`
    }

    this.candidates = !value ? [...symbols] : []
  }

  removeValue () {
    this.value = null
    this.candidates = [...symbols]
  }

  /**
 * @param {string} value
 */
  removeCandidate (c) {
    const index = this.candidates.indexOf(c)
    if (index !== -1) {
      this.candidates.splice(index, 1)
    }
  }

  /**
 * @param {string} value
 */
  addCandidate (c) {
    if (symbols.contains(c)) {
      this.candidates.push(c)
    }
  }

  isEmpty () {
    return !this.hasEntry()
  }

  hasEntry () {
    return !!this.value
  }

  resetCandidates () {
    if (this.isEmpty()) {
      this.candidates = [...symbols]
    } else {
      this.candidates = []
    }
  }
}

module.exports = {
  Cell,
  CellError,
  InvalidCoordinates,
  InvalidEntryError
}
