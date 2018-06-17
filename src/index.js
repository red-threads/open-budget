require('dotenv').config()
const app = require('express')()
const API = require('json-api')

const card = require('./card/model')
const db = require('./db')
const organization = require('./organization/model')
const { description: name, now: { alias } } = require('../package.json')
const rollbar = require('./rollbar')
const transaction = require('./transaction/model')
const transactionType = require('./transaction-type/model')

const port = process.env.PORT || 3000
const host = process.env.NOW ? `http://${alias}.now.sh` : `http://127.0.0.1:${port}`
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
    self: '/{type}/{id}'
  }
})

const Controller = new API.controllers.API(registry)
const Docs = new API.controllers.Documentation(registry, {
  name
})
const { apiRequest, docsRequest } = new API.httpStrategies.Express(Controller, Docs, {
  host
})

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
