const { string, object } = require('yup')

const toResourceType = require('../converters/to-resource-type')

const modelName = 'TransactionType'
const name = 'transaction-type'

const schema = object()
  .meta({
    description: 'Transaction types and related VAT rates'
  })
  .shape({
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
    value: Joi.number().required().integer().meta({
      description: 'Percent value. 1 === 0.01%, 100 === 1%'
    }),
    note: Joi.string().required(),
    fromCountry: Joi.string().required().length(2).regex(/^[A-Z]{2}$/),
    toCountry: Joi.string().required().length(2).regex(/^[A-Z]{2}$/)
  })

exports.modelName = modelName
exports.name = name
exports.resourceType = toResourceType(name, schema)
exports.schema = schema
