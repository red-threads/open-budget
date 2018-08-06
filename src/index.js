require('dotenv').config()
const timeout = require('connect-timeout')
const cors = require('cors')
const app = require('express')()
const API = require('json-api')

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
const entitiesToRoutes = entities
  .map(({ pluralName }) => pluralName)
  .join('|')

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
app.get(`/:type(${entitiesToRoutes})`, apiRequest)
app.get(`/:type(${entitiesToRoutes})/:id`, apiRequest)
app.post(`/:type(${entitiesToRoutes})`, apiRequest)
app.patch(`/:type(${entitiesToRoutes})/:id`, apiRequest)
app.delete(`/:type(${entitiesToRoutes})/:id`, apiRequest)

// Add routes for adding to, removing from, or updating resource relationships
/*
app.post(`/:type(${entitiesToRoutes}|places)/:id/relationships/:relationship`, apiRequest)
app.patch(`/:type(${entitiesToRoutes}|places)/:id/relationships/:relationship`, apiRequest)
app.delete(`/:type(${entitiesToRoutes}|places)/:id/relationships/:relationship`, apiRequest)
*/

app.use(rollbar.errorHandler())

app.listen(port)
