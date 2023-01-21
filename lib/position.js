const _ = require('lodash')

class InvalidCoordinates extends Error {
  /**
   * @param {Position} cell
   */
  constructor(position) {
    super(`Invalid coordinates: (${JSON.stringify(position)})`)
  }
}

class Position {
  constructor({ row, col }) {
    this.row = row
    this.col = col

    const isFinite = _.isFinite(this.row) && _.isFinite(this.col)
    const isPositive = this.row >= 0 && this.col >= 0
    if (!isFinite || !isPositive) {
      throw new InvalidCoordinates(this)
    }
  }

  valueOf() {
    return { row: this.row, col: this.col }
  }

  /**
   * @param {Position} other
   * @returns {boolean}
   */
  equals(other) {
    return _.isEqual(this, other)
  }
}

exports.Position = Position
