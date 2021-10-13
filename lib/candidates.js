const _ = require('lodash')
const { Symbols } = require('./symbols')

const validCandidates = new Set(Symbols.all())

class InvalidCandidateError extends Error {
  constructor (candidate) {
    super(`Invalid candidate: ${candidate}`)
  }
}

class ReadOnlyError extends Error {
  constructor (message = 'Cannot modify Read-Only value') {
    super(message)
  }
}

class Candidates {
  get candidates () {
    return _.compact([...this._candidates])
  }

  length () {
    return this.candidates.length
  }

  /**
   * @param {string[]=} candidates
   */
  constructor (candidates = []) {
    /** @private */
    this._candidates = candidates
    /** @private */
    this._candidateMap = {}
    for (const i in this._candidates) {
      // `_candidateMap` is used to keep internal track of candidate values and
      // their index in `this._candidates`
      this._candidateMap[this._candidates[i]] = i
    }

    return new Proxy(this, {
      get (target, prop, receiver) {
        if (prop === 'candidates') {
          return _.compact([...target._candidates])
        }

        if (prop.startsWith('_')) {
          return
        }

        const value = target[prop]
        if (typeof value === 'function') {
          return value.bind(target)
        }

        if (prop in target._candidates) {
          return Reflect.get(target._candidates, prop, receiver)
        }

        return Reflect.get(target, prop, receiver)
      },

      set (obj, prop, value) {
        if (prop.startsWith('_')) {
          throw new ReadOnlyError()
        }

        if (typeof value !== 'function') {
          return Reflect.set(obj, prop, value)
        }

        return false
      }
    })
  }

  valueOf () {
    return this.candidates
  }

  toString () {
    return JSON.stringify(this.candidates)
  }

  /**
   * @param {string} candidate
   * @returns {boolean} returns true if the candidate was added, false if the
   * candidate already exists
   */
  add (candidate) {
    if (!validCandidates.has(candidate)) {
      throw new InvalidCandidateError(candidate)
    }

    if (!this.has(candidate)) {
      this._candidateMap[candidate] = this._candidates.push(candidate) - 1
    }

    return false
  }

  /**
   * Replaces the current candidates with a new Array of candidates
   * @param {string[]} candidates
   */
  set (candidates) {
    this.clear()
    for (const c of candidates) {
      this.add(c)
    }
  }

  pop () {
    const c = this.candidates.pop()
    this.remove(c)
    return c
  }

  /**
   * @param {string} candidate
   * @returns {boolean} returns true if the candidate was removed, false otherwise
   */
  remove (candidate) {
    if (candidate in this._candidateMap) {
      const index = this._candidateMap[candidate]
      delete this._candidateMap[candidate]
      this._candidates[index] = null
      return true
    }

    return false
  }

  has (candidate) {
    return candidate in this._candidateMap
  }

  sort () {
    this._candidates.sort()
    for (const i in this._candidates) {
      const value = this._candidates[i]
      if (value) {
        this._candidateMap[value] = i
      }
    }
  }

  clear () {
    this._candidates = []
    this._candidateMap = {}
  }
}

exports.Candidates = Candidates
