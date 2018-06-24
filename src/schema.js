const Joi = require('joi')
const Joigoose = require('joigoose')
const Mongoose = require('mongoose')

const joigooseInstance = Joigoose(Mongoose)

const options = {
  timestamps: true
}

function getMongooseSchema(joiSchema) {
  return new Mongoose.Schema(joigooseInstance.convert(joiSchema), options)
}

function getMongooseModel(modelName, schema) {
  return Mongoose.model(modelName, schema)
}

exports.getMongooseSchema = getMongooseSchema
exports.getMongooseModel = getMongooseModel
exports.options = options
