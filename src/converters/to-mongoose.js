const Mongoose = require('mongoose')
const { reach } = require('yup')

const schemaOptions = {
  timestamps: true
}

function getType(what, meta) {
  switch (what) {
    case 'string':
      return String
    case 'number':
      return Number
    case 'date': 
      return Date
    case 'mixed':
      if (meta.objectId && meta.ref) {
        return Mongoose.Schema.Types.ObjectId
      }
      return Mongoose.Schema.Types.Mixed
  }
}

function getRef({ objectId, ref } = {}) {
  if (objectId && ref) {
    return {
      ref
    }
  }
}

function getRequired(tests = []) {
  if (tests.includes('required')) {
    return {
      required: true
    }
  }
}

function getValidation(schema, key) {
  const subSchema = reach(schema, key)
  return {
    validate: (v) => subSchema.isValid(v)
  }
}

function getMongooseSchema(schema) {
  const { fields } = schema.describe()
  return new Mongoose.Schema(
    Object.keys(fields)
      .reduce((mongooseFields, key) => {
        const { type, meta, tests } = fields[key]
        mongooseFields[key] = Object.assign(
          {
            type: getType(type, meta)
          },
          getRef(meta),
          getRequired(tests),
          getValidation(schema, key)
        )
        return mongooseFields
      }, {}),
    schemaOptions
  )
}

function getMongooseModel(modelName, schema) {
  return Mongoose.model(modelName, getMongooseSchema(schema))
}

exports.getMongooseSchema = getMongooseSchema
exports.getMongooseModel = getMongooseModel
