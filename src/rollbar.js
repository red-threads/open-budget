const Rollbar = require('rollbar')

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TOKEN,
  captureUnhandledRejections: true
})

module.exports = rollbar
