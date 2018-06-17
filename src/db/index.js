const mongoose = require('mongoose')
const rollbar = require('../rollbar')

const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/test?retryWrites=true`

module.exports = function () {
  mongoose.connect(url)
  mongoose.connection.on('error', (err) =>
    rollbar.error(err)
  )
  mongoose.connection.once('open', function () {
    console.info('Connection succeeded')
  })
}
