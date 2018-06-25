const { array, object, string } = require('yup')

const toResourceType = require('../converters/to-resource-type')

const modelName = 'Organization'
const name = 'organization'

const schema = object()
  .meta({
    description: 'Organization'
  })
  .shape({
    name: Joi.string().required(),
    alias: Joi.string().required(),
    parent: Joi.string().meta({ type: 'ObjectId', ref: 'Organization' }),
    card: Joi.string().required().meta({ type: 'ObjectId', ref: 'Card' }),
    people: Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'Card' })),
    feeAsGateway: Joi.number().default(0).meta({
      description: 'Percent value. 1 === 0.01%, 100 === 1%'
    })
  })

exports.modelName = modelName
exports.name = name
exports.resourceType = toResourceType(name, schema)
exports.schema = schema
