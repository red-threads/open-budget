const Joi = require('joi')
const pluralize = require('pluralize')
const { getMongooseSchema, getMongooseModel } = require('../schema')

const name = 'card'
const modelName = 'Card'

const resourceType = {
  urlTemplates: {
    self: `/${name}/{id}`
  },
  info: {
    description: 'Address and contact information for a company, person, organization. It tries to mimick the format available at http://microformats.org/wiki/h-card',
    fields: {
      iban: {
        description: 'Account\'s IBAN. If this is specified, currency is required'
      },
      bic: {
        description: 'BIC/Swift code. Optional (IBAN is usually enough)'
      },
      currency: {
        description: 'Account\'s currency. If this is specified, IBAN is required'
      }
    }
  }
}

const joiSchema = Joi.object({
  category: Joi.string().required().valid(['business', 'person']),
  name: Joi.string().required(),
  givenName: Joi.string(),
  additionalName: Joi.string(),
  familyName: Joi.string(),
  nickname: Joi.string(),
  email: Joi.string().required().email(),
  logo: Joi.string(),
  photo: Joi.string(),
  url: Joi.string(),
  extendedAddress: Joi.string(),
  streetAddress: Joi.string(),
  locality: Joi.string(),
  region: Joi.string(),
  postalCode: Joi.string(),
  countryCode: Joi.string().required().length(2).regex(/^[A-Z]{2}$/),
  geoLatitude: Joi.string(),
  geoLongitude: Joi.string(),
  telephone: Joi.string(),
  notes: Joi.string(),
  birthday: Joi.date(),
  publicKey: Joi.string(),
  organization: Joi.string(),
  role: Joi.string(),
  iban: Joi.string().min(15),
  bic: Joi.string().min(8).max(11),
  currency: Joi.string().valid(['EUR', 'GBP'])
})
const mongooseSchema = getMongooseSchema(joiSchema)

exports.name = name
exports.pluralName = pluralize(name)
exports.modelName = modelName
exports.joiSchema = joiSchema
exports.mongooseSchema = mongooseSchema
exports.model = getMongooseModel(modelName, mongooseSchema)
exports.resourceType = resourceType
