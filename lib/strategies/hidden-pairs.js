const { getSubsetCellsWith, removeCandidates } = require('./utils')

/**
 * @param {import('../puzzle').Puzzle} puzzle
 * @returns {boolean} returns true if a solution was found, false otherwise
 */
exports.apply = (puzzle) => {
  const groups = puzzle.cellGroups()
  for (const cells of groups) {
    for (const result of getSubsetCellsWith({ cells, sharedCandidates: 2, cellCount: 2 })) {
      const excludedCandidates = [...new Set(
        result.cells.flatMap(cell => cell.candidates.candidates)
          .filter(candidate => !result.candidates.includes(candidate))
      )]

      if (removeCandidates(result.cells, excludedCandidates)) {
        puzzle.digestCells(result.cells)
        return true
      }
    }
  }

  return false
}
