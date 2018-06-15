const mongoose = require('mongoose')
const pluralize = require('pluralize')
const { merge } = require('timm')
const { defaultSchema, options } = require('../schema')

const name = 'organization'
const modelName = 'Organization'
const schema = mongoose.Schema(merge(defaultSchema, {
  name: {
    type: String,
    required: true
  },
  alias: {
    type: String,
    default: function () {
      return this.name
    }
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  people: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card'
    }
  ],
  feeAsGateway: {
    type: Number,
    default: 0
  }
}), options)
const resourceType = {
  urlTemplates: {
    self: `/${name}/{id}`
  },
  info: {
    description: 'Organization',
    fields: {
      feeAsGateway: {
        description: 'Percent value. 1 === 0.01%, 100 === 1%'
      }
    }
  }
}

exports.name = name
exports.pluralName = pluralize(name)
exports.modelName = modelName
exports.schema = schema
exports.model = mongoose.model(modelName, schema)
exports.resourceType = resourceType
