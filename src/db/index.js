const mongoose = require('mongoose')

const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/test?retryWrites=true`

module.exports = function () {
  mongoose.connect(url)
  mongoose.connection.on('error', (err) =>
    console.error('connection error', err)
  )
  mongoose.connection.once('open', function () {
    console.info('Connection succeeded')
  })
}
