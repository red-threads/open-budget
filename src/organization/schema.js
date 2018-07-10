const { array, mixed, number, object, string } = require('yup')

const toResourceType = require('../converters/to-resource-type')

const modelName = 'Organization'
const name = 'organization'

const schema = object()
  .meta({
    description: 'Organization',
    name
  })
  .shape({
    name: string().required().meta({ isIndex: true }).label('Organization Name'),
    alias: string().required().label('Alias'),
    parent: mixed().default('').meta({ type: 'ObjectId', ref: 'Organization' }).label('Parent Organization'),
    card: mixed().required().meta({ type: 'ObjectId', ref: 'Card' }).label('Related Card'),
    people: array().of(mixed().meta({ type: 'ObjectId', ref: 'Card' })).label('List of connected people'),
    feeAsGateway: number().default(0).meta({
      description: 'Percent value. 1 === 0.01%, 100 === 1%'
    }).label('Gateway fee')
  })

exports.modelName = modelName
exports.name = name
exports.resourceType = toResourceType(name, schema)
exports.schema = schema
