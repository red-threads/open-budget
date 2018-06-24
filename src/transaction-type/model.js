const Joi = require('joi')
const pluralize = require('pluralize')
const { getMongooseSchema, getMongooseModel } = require('../schema')

const name = 'transaction-type'
const modelName = 'TransactionType'

const resourceType = {
  urlTemplates: {
    self: `/${name}/{id}`
  },
  info: {
    description: 'Transaction types and related VAT rates',
    fields: {
      value: {
        description: 'Percent value. 1 === 0.01%, 100 === 1%'
      }
    }
  }
}

const joiSchema = Joi.object({
  type: Joi.string().required().valid([
    'taxes',
    'ticket',
    'donation',
    'ads',
    'sponsorship',
    'refund',
    'online_service',
    'physical_service',
    'physical_good'
  ]),
  value: Joi.number().required().integer(),
  note: Joi.string().required(),
  fromCountry: Joi.string().required().length(2).regex(/^[A-Z]{2}$/),
  toCountry: Joi.string().required().length(2).regex(/^[A-Z]{2}$/)
})
const mongooseSchema = getMongooseSchema(joiSchema)

exports.name = name
exports.pluralName = pluralize(name)
exports.modelName = modelName
exports.joiSchema = joiSchema
exports.mongooseSchema = mongooseSchema
exports.model = getMongooseModel(modelName, mongooseSchema)
exports.resourceType = resourceType
