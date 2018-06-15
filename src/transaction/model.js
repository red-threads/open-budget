const mongoose = require('mongoose')
const pluralize = require('pluralize')
const { merge } = require('timm')
const { defaultSchema, options } = require('../schema')

const name = 'transaction'
const modelName = 'Transaction'
const schema = mongoose.Schema(merge(defaultSchema, {
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VatRate',
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  gateway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  gross: {
    type: Number,
    validate: function (v) {
      return v === this.gatewayFee + this.vat + this.net
    },
    required: true
  },
  vat: {
    type: Number,
    validate: function (v) {
      return v === (this.gross * this.type.value) / 10000
    },
    required: true
  },
  gatewayFee: {
    type: Number,
    validate: function (v) {
      if (!this.gateway) {
        return v === 0
      }
      return v === (this.net * this.gateway.feeAsGateway) / 10000
    },
    default: 0
  },
  net: {
    type: Number,
    validate: function (v) {
      return v === this.gross - this.vat - this.gatewayFee
    },
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processed'],
    required: true
  },
  source: {
    type: String,
    enum: ['manual', 'csv', 'data_sync'],
    default: 'manual'
  },
  originalTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  invoice: {
    type: String
  },
  externalReference: {
    type: String
  }
}), options)
const resourceType = {
  urlTemplates: {
    self: `/${name}/{id}`
  },
  info: {
    description: 'Organization',
    fields: {
      originalTransaction: {
        description: 'In case this transaction originates from another recorded transaction (e.g.: refund), please use this field'
      },
      invoice: {
        description: 'Link to a third-party invoice, if any'
      },
      externalReference: {
        description: 'Reference ID to a third-party system'
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
