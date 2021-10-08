const strategies = require('./lib/strategies')

module.exports = {
  ...require('./lib/puzzle'),
  ...require('./lib/cell'),
  ...require('./lib/symbols'),
  strategies
}
