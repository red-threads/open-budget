const mongoose = require('mongoose')
const rollbar = require('../rollbar')

const url = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/${process.env.MONGO_DB}?retryWrites=true`

module.exports = function () {
  console.info('will connect to', process.env.MONGO_SERVER)
  mongoose.connect(url)
  mongoose.connection.on('error', (err) => {
    console.error('Connection failed')
    console.error(err)
    rollbar.error(err)
  })
  mongoose.connection.once('open', function () {
    console.info('Connection succeeded')
  })
}
