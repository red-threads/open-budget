const Joi = require('joi')
const pluralize = require('pluralize')
const { getMongooseSchema, getMongooseModel } = require('../schema')

const name = 'organization'
const modelName = 'Organization'

const resourceType = {
  urlTemplates: {
    self: `/${name}/{id}`
  },
  info: {
    description: 'Organization',
    fields: {
      feeAsGateway: {
        description: 'Percent value. 1 === 0.01%, 100 === 1%'
      }
    }
  }
}

const joiSchema = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string().required(),
  parent: Joi.string().meta({ type: 'ObjectId', ref: 'Organization' }),
  card: Joi.string().required().meta({ type: 'ObjectId', ref: 'Card' }),
  people: Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'Card' })),
  feeAsGateway: Joi.number().default(0)
})
const mongooseSchema = getMongooseSchema(joiSchema)

exports.name = name
exports.pluralName = pluralize(name)
exports.modelName = modelName
exports.joiSchema = joiSchema
exports.mongooseSchema = mongooseSchema
exports.model = getMongooseModel(modelName, mongooseSchema)
exports.resourceType = resourceType
