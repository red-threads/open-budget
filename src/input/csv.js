const { promisify } = require('util')
const parse = promisify(require('csv-parse'))

function parseCsv (input) {
  return parse(input, {
    columns: true
  })
}

parseCsv('"key_1","key_2"\n"value 1","value 2"\n"value 3","value 4"')
  .then(console.log)

module.exports = parseCsv
