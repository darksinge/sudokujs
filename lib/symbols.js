const numbers = () => '123456789'.split('')
const alphabetUpper = () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const alphabetLower = () => alphabetUpper()
  .join('')
  .toLowerCase()
  .split('')

exports.Symbols = Object.freeze({
  x4: () => numbers().splice(0, 4),
  x9: () => numbers(),
  x16: () => [...numbers(), ...alphabetUpper()].splice(0, 16),
  x25: () => [...numbers(), ...alphabetUpper()].splice(0, 25),
  x36: () => [...numbers(), ...alphabetUpper(), '@'],
  x49: () => [...numbers(), ...alphabetUpper(), ...alphabetLower()].splice(0, 49),
  empty: '-'
})
