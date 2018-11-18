const mongoose = require('mongoose')
const rollbar = require('../rollbar')

module.exports = function () {
  console.info('will connect to MongoDB')
  mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true
  })
  mongoose.connection.on('error', (err) => {
    console.error('Connection failed')
    console.error(err)
    rollbar.error(err)
  })
  mongoose.connection.once('open', function () {
    console.info('Connection succeeded')
  })
}
