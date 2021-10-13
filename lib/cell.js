// const _ = require('lodash')
const { Candidates } = require('./candidates')
const { Position } = require('./position')
const { Symbols } = require('./symbols')

const validSymbols = new Set(Symbols.all())

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

class Cell {
  get row () {
    return this.position.row
  }

  get col () {
    return this.position.col
  }

  /**
   * @param {Object} params
   * @param {string} params.value
   * @param {number} params.row
   * @param {number} params.col
   */
  constructor ({ value = null, row, col, candidates = [] }) {
    this.value = null
    this.position = new Position({ row, col })
    this.isGiven = !!value
    this.candidates = new Candidates(candidates)
    this._originalCandidates = Object.freeze([...candidates])
    if (this.isGiven) {
      this.enterValue(`${value}`)
    }
  }

  valueOf () {
    return this.value
  }

  toString () {
    return this.value || Symbols.empty
  }

  /**
   * @param {string} value
   */
  enterValue (value) {
    if (!validSymbols.has(value)) {
      throw new InvalidEntryError(value)
    }

    this.value = value
    this.candidates.clear()
  }

  clear () {
    if (!this.isGiven) {
      this.value = null
    }
  }

  resetCandidates () {
    this.candidates.set([...this._originalCandidates])
  }

  isEmpty () {
    return !this.hasEntry()
  }

  hasEntry () {
    return !!this.value
  }
}

module.exports = {
  Cell,
  CellError,
  InvalidEntryError
}
