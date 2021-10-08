const _ = require('lodash')

/**
 * @param {import('../puzzle').Puzzle} puzzle
 * @returns {boolean} returns true if a solution was found, false otherwise
 */
exports.apply = (puzzle) => {
  // Loop through every cell
  for (const cell of _.flatten(puzzle.cells)) {
    // If a cell only has 1 candidate, then that must be the solution for that cell
    if (cell.candidates.length === 1) {
      const value = cell.candidates.pop()
      puzzle.enterValue({
        value,
        row: cell.row,
        col: cell.col
      })

      return true
    }
  }

  return false
}
