const port = process.env.PORT || 3000
const host = process.env.API_URL
const allowedCORSHosts = [process.env.CLIENT_URL]

if (process.env.CORS_HOSTS) {
  allowedCORSHosts.push(process.env.CORS_HOSTS.split(','))
}

exports.allowedCORSHosts = allowedCORSHosts
exports.host = host
exports.port = port
