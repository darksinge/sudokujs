/**
 * @typedef {import('../cell').Cell} Cell
 * @typedef {import('../position').Position} Position
 * @typedef {{ cells: Cell[], candidates: string[] }} CellComboResult
 */

const _ = require('lodash')

/**
 * @template T
 * @param {T[]} values
 * @returns {Array<T[]>}
 */
// const combinations = (values) => values.flatMap((v, i) values.slice(i + 1).map())
const combinations = (values, k) => {
  const combinationsRecursive = (values, k) => {
    const result = []
    if (k > values.length || k < 1) {
      return []
    }

    if (k === values.length) {
      return [values]
    }

    if (k === 1) {
      return values.map(v => [v])
    }

    for (let i = 0; i < values.length - k + 1; i++) {
      const head = values.slice(i, i + 1)
      const tail = combinations(values.slice(i + 1), k - 1)
      for (let j = 0; j < tail.length; j++) {
        result.push(head.concat(tail[j]))
      }
    }

    return result
  }

  const combos = combinationsRecursive(values, k)
    .map(combo => [...new Set(combo)].sort())
    .filter(combo => combo.length === k)

  return _.uniqWith(combos, _.isEqual)
}

/**
 * Returns a 1-D array of all candidates in `cells`, including duplicates.
 * @param {Cell[]} cells
 * @param {Cell[]} excluding
 * @returns {string[]}
 */
exports.getCandidates = (cells, excluding = []) => {
  const results = cells.filter(cell => {
    for (const other of excluding) {
      if (other.position.equals(cell.position)) {
        return false
      }
    }

    return true
  })

  return results.flatMap(cell => cell.candidates.candidates ?? [])
}

/**
 * Returns a 1-D array of all candidates in `cells`, including duplicates.
 * @param {Cell[]} cells
 * @param {Cell[]} excluding
 * @returns {string[]}
 */
exports.getCandidatesUniq = (cells, excluding) => _.uniq(exports.getCandidates(cells, excluding))

/**
 * Returns cells with a given number of shared candidates, if the shared
 * candidates are naked (e.g., not part of a subset)
 * @param {Object} params
 * @param {Cell[]} params.cells
 * @param {number} params.sharedCandidates
 * @param {number=} params.cellCount
 * @returns {CellComboResult[]}
 */
exports.getNakedCellsWith = ({ cells, sharedCandidates = 1, cellCount = null }) => {
  const unsolved = cells.filter(cell => cell.isEmpty())
  const included = unsolved.filter(cell => !(cell.candidates.length() < sharedCandidates))

  const results = []
  const combos = combinations(exports.getCandidates(included), sharedCandidates)
  for (const combo of combos) {
    combo.sort()

    const cells = included.filter(cell => cell.candidates.candidates.every(c => combo.includes(c)))
      .filter(cell => {
        const candidates = [...cell.candidates.candidates]
        candidates.sort()
        return _.isEqualWith(candidates, combo)
      })

    if (typeof cellCount === 'number' && cells.length !== cellCount) {
      continue
    }

    results.push({
      cells: [...cells],
      candidates: combo
    })
  }

  return results
}

/**
 * Returns cells with a given number of shared candidates, if the shared
 * candidates are part of a subset (e.g., not naked)
 * @param {Object} params
 * @param {Cell[]} params.cells
 * @param {number} params.sharedCandidates
 * @param {number} params.cellCount
 * @returns {{ cells: Cell[]; candidates: string[] }}
 */
exports.getSubsetCellsWith = ({ cells, sharedCandidates = 1, cellCount }) => {
  const unsolved = exports.getUnsolvedCells(cells)
    .filter(cell => cell.candidates.candidates.length >= sharedCandidates)

  const results = []
  const combos = combinations(exports.getCandidates(unsolved), sharedCandidates)
  for (const combo of combos) {
    const cells = unsolved
      .filter(cell => combo.every(c => cell.candidates.has(c)))

    if (cellCount === cells.length) {
      results.push({
        cells,
        candidates: combo
      })
    }
  }

  return results
}

/**
 * @param {Cell[]} cells
 * @param {Cell[]} exclude - Cells to exclude from the result
 * @returns {Cell[]}
 */
exports.getUnsolvedCells = (cells, exclude = []) => {
  const positions = exports.getPositions(exclude)
  return cells
    .filter(cell => cell.isEmpty())
    .filter(cell => !positions.some(pos => pos.equals(cell.position)))
}

/**
 * @param {Cell[]} cells
 * @param {Cell[]} exclude - Cells to exclude from the result
 * @returns {Cell[]}
 */
exports.getSolvedCells = (cells, exclude = []) => {
  const positions = exports.getPositions(exclude)
  return cells.filter(cell => !cell.isEmpty())
    .filter(cell => positions.find(pos => pos.equals(cell.position)))
}

/**
 * @param {Cell[]} cells
 * @returns {Position[]}
 */
exports.getPositions = (cells) => cells.map(cell => cell.position)

/**
 * @param {Cell[]} cells
 * @param {string} candidate
 * @returns {boolean}
 */
const removeCandidate = (cells, candidate) => {
  let success = false
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].candidates.remove(candidate)) {
      success = true
    }
  }

  return success
}

/**
 * @param {Cell[]} cells
 * @param {string[]} candidates
 * @returns {boolean}
 */
exports.removeCandidates = (cells, candidates) => {
  let success = false
  for (let i = 0; i < candidates.length; i++) {
    if (removeCandidate(cells, candidates[i])) {
      success = true
    }
  }

  return success
}
