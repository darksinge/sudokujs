const { getNakedCellsWith, getUnsolvedCells, removeCandidates } = require('./utils')

/**
 * @param {import('../puzzle').Puzzle} puzzle
 * @returns {boolean} returns true if a solution was found, false otherwise
 */
exports.apply = (puzzle) => {
  const groups = puzzle.cellGroups()
  for (const cells of groups) {
    for (const result of getNakedCellsWith({ cells, sharedCandidates: 2, cellCount: 2 })) {
      const unsolved = getUnsolvedCells(cells, result.cells)

      if (removeCandidates(unsolved, result.candidates)) {
        puzzle.digestCells(unsolved)
        return true
      }
    }
  }

  return false
}
