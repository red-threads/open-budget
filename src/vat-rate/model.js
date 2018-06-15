const mongoose = require('mongoose')
const pluralize = require('pluralize')
const { merge } = require('timm')
const { defaultSchema, options } = require('../schema')

const name = 'vat-rate'
const modelName = 'VatRate'
const schema = mongoose.Schema(merge(defaultSchema, {
  type: {
    type: String,
    required: true,
    enum: [
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
  },
  value: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  fromCountry: {
    type: String,
    minlength: 2,
    maxlength: 2,
    uppercase: true,
    required: true
  },
  toCountry: {
    type: String,
    minlength: 2,
    maxlength: 2,
    uppercase: true,
    required: true
  }
}), options)
const resourceType = {
  urlTemplates: {
    self: `/${name}/{id}`
  },
  info: {
    description: 'Transaction types and related VAT rates',
    fields: {
      value: {
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
