require('dotenv').config()
const timeout = require('connect-timeout')
const cors = require('cors')
const app = require('express')()
const jwt = require('express-jwt')
const jwtAuthz = require('express-jwt-authz')
const API = require('json-api')
const jwks = require('jwks-rsa')

const card = require('./card')
const db = require('./db')
const { allowedCORSHosts, host, port } = require('./host')
const organization = require('./organization')
const { description: name } = require('../package.json')
const rollbar = require('./rollbar')
const transaction = require('./transaction')
const transactionType = require('./transaction-type')

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedCORSHosts.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWT_JWKS_URI
  }),
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  algorithms: ['RS256']
})

const entities = [
  card,
  organization,
  transaction,
  transactionType
]
const models = entities.reduce((modelsToReturn, { modelName, model }) => {
  modelsToReturn[modelName] = model
  return modelsToReturn
}, {})
const resources = entities.reduce((resourcesToReturn, { pluralName, resourceType }) => {
  resourcesToReturn[pluralName] = resourceType
  return resourcesToReturn
}, {})

db()

const dbAdapter = new API.dbAdapters.Mongoose(models)
const registry = new API.ResourceTypeRegistry(resources, {
  dbAdapter,
  urlTemplates: {
    self: `${host}/{type}/{id}`
  }
})

const Controller = new API.controllers.API(registry)
const Docs = new API.controllers.Documentation(registry, {
  name
})
const { apiRequest, docsRequest } = new API.httpStrategies.Express(Controller, Docs, {
  host
})

app.use(cors(corsOptions))
app.use(timeout(5000))

app.options('*')
app.get('/', docsRequest)
app.get('/ping/api', apiRequest)

entities.forEach(({ name, pluralName }) => {
  app.get(`/:type(${pluralName})`, jwtCheck, jwtAuthz([`list:${name}`]), apiRequest)
  app.get(`/:type(${pluralName})/:id`, jwtCheck, jwtAuthz([`read:${name}`]), apiRequest)
  app.post(`/:type(${pluralName})`, jwtCheck, jwtAuthz([`create:${name}`]), apiRequest)
  app.patch(`/:type(${pluralName})/:id`, jwtCheck, jwtAuthz([`update:${name}`]), apiRequest)
  app.delete(`/:type(${pluralName})/:id`, jwtCheck, jwtAuthz([`delete:${name}`]), apiRequest)
})

app.use(rollbar.errorHandler())

app.listen(port)
