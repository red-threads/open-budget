const Mongoose = require('mongoose')
const { reach } = require('yup')

const schemaOptions = {
  timestamps: true
}

function getType ({ type, innerType, meta = {} }) {
  switch (type) {
    case 'string':
      return String
    case 'number':
      return Number
    case 'date':
      return Date
    case 'array':
      return [ getType(innerType) ]
    case 'mixed':
      return Mongoose.Schema.Types[meta.type || 'Mixed']
  }
}

function extractMeta ({ type, meta: { type: metaType, ref, oneOf } = {} }) {
  if (metaType === 'ObjectId' && ref) {
    return {
      ref
    }
  } else if (type === 'string' && oneOf) {
    return {
      enum: oneOf
    }
  }
}

function extractTests ({ tests = [] }) {
  let basicTests = {}
  if (tests.includes('required')) {
    basicTests.required = true
  }
  return basicTests
}

function extractValidation (schema, key) {
  const subSchema = reach(schema, key)
  return {
    validate: (v) => subSchema.isValid(v)
  }
}

function extractDefault (schema, key) {
  const subSchema = reach(schema, key)
  const defaultValue = subSchema.default()
  if (defaultValue) {
    return {
      default: defaultValue
    }
  }
}

function getMongooseSchema (schema) {
  const { fields } = schema.describe()
  return new Mongoose.Schema(
    Object.keys(fields)
      .reduce((mongooseFields, key) => {
        const fieldSchemaDescription = fields[key]
        mongooseFields[key] = Object.assign(
          {
            type: getType(fieldSchemaDescription)
          },
          extractDefault(schema, key),
          extractMeta(fieldSchemaDescription),
          extractTests(fieldSchemaDescription),
          extractValidation(schema, key)
        )
        return mongooseFields
      }, {}),
    schemaOptions
  )
}

function getMongooseModel (modelName, schema) {
  return Mongoose.model(modelName, getMongooseSchema(schema))
}

exports.getMongooseSchema = getMongooseSchema
exports.getMongooseModel = getMongooseModel
