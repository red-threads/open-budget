const Joi = require('joi')
const pluralize = require('pluralize')
const { getMongooseSchema, getMongooseModel } = require('../schema')

const name = 'transaction'
const modelName = 'Transaction'

function getDescription(field) {
  switch (field) {
    case 'originalTransaction':
      return 'In case this transaction originates from another recorded transaction (e.g.: refund), please use this field'
    case 'invoice':
      return 'Link to a third-party invoice, if any'
    case 'externalReference':
      return 'Reference ID to a third-party system'
    default:
      return ''
  }
}

const resourceType = {
  urlTemplates: {
    self: `/${name}/{id}`
  },
  info: {
    description: 'Organization',
    fields: ['originalTransaction', 'invoice', 'externalReference'].reduce((allFields, fieldName) => {
      allFields[fieldName] = {
        description: getDescription(fieldName)
      }
      return allFields
    }, {})
  }
}

const joiSchema = Joi.object({
  type: Joi.string().required().meta({ type: 'ObjectId', ref: 'TransactionType' }),
  from: Joi.string().required().meta({ type: 'ObjectId', ref: 'Card' }),
  gateway: Joi.string().meta({ type: 'ObjectId', ref: 'Organization' }),
  to: Joi.string().required().meta({ type: 'ObjectId', ref: 'Card' }),
  gross: Joi.number().required().integer().meta({
    validate: function (v) {
      return v === this.gatewayFee + this.vat + this.net
    }
  }),
  vat: Joi.number().required().integer().meta({
    validate: function (v) {
      return v === (this.gross * this.type.value) / 10000
    }
  }),
  gatewayFee: Joi.number().default(0).integer().meta({
    validate: function (v) {
      if (!this.gateway) {
        return v === 0
      }
      return v === (this.net * this.gateway.feeAsGateway) / 10000
    }
  }),
  net: Joi.number().required().integer().meta({
    validate: function (v) {
      return v === this.gross - this.vat - this.gatewayFee
    }
  }),
  status: Joi.string().required().valid(['pending', 'processed']),
  source: Joi.string().default('manual').valid(['manual', 'csv', 'data_sync']),
  originalTransaction: Joi.string().meta({
    type: 'ObjectId',
    ref: 'Transaction'
  }).description(getDescription('originalTransaction')),
  invoice: Joi.string().description(getDescription('invoice')),
  externalReference: Joi.string().description(getDescription('externalReference'))
})
const mongooseSchema = getMongooseSchema(joiSchema)

exports.name = name
exports.pluralName = pluralize(name)
exports.modelName = modelName
exports.joiSchema = joiSchema
exports.mongooseSchema = mongooseSchema
exports.model = getMongooseModel(modelName, mongooseSchema)
exports.resourceType = resourceType
