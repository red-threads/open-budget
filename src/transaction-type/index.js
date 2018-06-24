const pluralize = require('pluralize')

const { getMongooseModel } = require('../converters/to-mongoose')
const { modelName, name, resourceType, schema } = require('./schema')

exports.model = getMongooseModel(modelName, schema)
exports.modelName = modelName
exports.name = name
exports.pluralName = pluralize(name)
exports.resourceType = resourceType
