const { getNakedCellsWith } = require('./utils')

/**
 * @param {import('../puzzle').Puzzle} puzzle
 * @returns {boolean} returns true if a solution was found, false otherwise
 */
exports.apply = (puzzle) => {
  const groups = puzzle.cellGroups()
  for (const cells of groups) {
    for (const result of getNakedCellsWith({ cells, sharedCandidates: 2, cellCount: 2 })) {
      let success = false
      const unsolved = cells.filter(cell => cell.isEmpty())
        .filter(cell => {
          for (const { position } of result.cells) {
            if (cell.position.equals(position)) {
              return false
            }
          }

          return true
        })

      for (const cell of unsolved) {
        for (const c of result.candidates) {
          if (puzzle.cells[cell.row][cell.col].candidates.remove(c)) {
            success = true
          }
        }
      }

      if (success) {
        return true
      }
    }
  }

  return false
}
