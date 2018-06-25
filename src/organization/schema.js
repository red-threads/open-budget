const { array, mixed, number, object, string } = require('yup')

const toResourceType = require('../converters/to-resource-type')

const modelName = 'Organization'
const name = 'organization'

const schema = object()
  .meta({
    description: 'Organization'
  })
  .shape({
    name: string().required(),
    alias: string().required(),
    parent: mixed().meta({ type: 'ObjectId', ref: 'Organization' }),
    card: mixed().required().meta({ type: 'ObjectId', ref: 'Card' }),
    people: array().of(mixed().meta({ type: 'ObjectId', ref: 'Card' })),
    feeAsGateway: number().default(0).meta({
      description: 'Percent value. 1 === 0.01%, 100 === 1%'
    })
  })

exports.modelName = modelName
exports.name = name
exports.resourceType = toResourceType(name, schema)
exports.schema = schema
