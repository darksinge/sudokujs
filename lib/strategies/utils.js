/**
 * @typedef {import('../cell').Cell} Cell
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

  const candidates = results.flatMap(cell => cell.candidates.candidates ?? [])

  console.log(candidates)
  return candidates
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
 * @param {number=} params.cellCount
 */
exports.getSubsetCellsWith = ({ cells, sharedCandidates = 1, cellCount = null }) => {
  const unsolved = cells.filter(cell => cell.isEmpty())
  const included = unsolved.filter(cell => cell.candidates.length > sharedCandidates)

  const results = []
  for (const combo of new Set(combinations(exports.getCandidates(included), sharedCandidates))) {
    console.log(combo)
    const cells = included.filter(cell => cell.candidates.every(c => combo.includes(c)))
      .filter(cell => combo.every(c => cell.candidates.includes(c)))

    if (typeof cellCount === 'number' && cells.length !== cellCount) {
      continue
    }

    results.push({
      cells: [...cells],
      candidates: [...combo]
    })
  }

  return results
}
