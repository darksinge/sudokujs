const { getSubsetCellsWith, getUnsolvedCells } = require('./utils')

/**
 * @param {import('../puzzle').Puzzle} puzzle
 * @returns {boolean} returns true if a solution was found, false otherwise
 */
exports.apply = (puzzle) => {
  const groups = puzzle.cellGroups()
  for (const cells of groups) {
    for (const result of getSubsetCellsWith({ cells, sharedCandidates: 2, cellCount: 2 })) {
      const success = false
      const unsolved = getUnsolvedCells(cells, result.cells)
    }
  }
}
