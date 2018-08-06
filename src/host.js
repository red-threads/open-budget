const { now: { alias } } = require('../package.json')

const port = process.env.PORT || 3000
const host = process.env.NOW ? `http://${alias}.now.sh` : `http://127.0.0.1:${port}`

const allowedCORSHosts = [
  `http://localhost:${port}`,
  `https://localhost:${port}`
].concat((process.env.CORS_HOSTS || '').split(','))

exports.allowedCORSHosts = allowedCORSHosts
exports.host = host
exports.port = port
