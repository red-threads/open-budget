const { number, object, string } = require('yup')

const toResourceType = require('../converters/to-resource-type')

const modelName = 'TransactionType'
const name = 'transaction-type'

const typeEnums = [
  'taxes',
  'ticket',
  'donation',
  'ads',
  'sponsorship',
  'refund',
  'online_service',
  'physical_service',
  'physical_good'
]

const schema = object()
  .meta({
    description: 'Transaction types and related VAT rates',
    name
  })
  .shape({
    type: string().required().oneOf(typeEnums).meta({
      oneOf: typeEnums
    }),
    value: number().required().integer().meta({
      description: 'Percent value. 1 === 0.01%, 100 === 1%',
      type: 'percent'
    }),
    note: string().meta({
      description: 'Note added to invoices using this transaction type'
    }).required(),
    fromCountry: string().required().length(2).matches(/^[A-Z]{2}$/),
    toCountry: string().required().length(2).matches(/^[A-Z]{2}$/)
  })

exports.modelName = modelName
exports.name = name
exports.resourceType = toResourceType(name, schema)
exports.schema = schema
