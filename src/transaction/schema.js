const { mixed, number, object, string } = require('yup')

const toResourceType = require('../converters/to-resource-type')

const modelName = 'Transaction'
const name = 'transaction'

const schema = object()
  .meta({
    description: 'Transaction',
    name
  })
  .shape({
    type: mixed().required().meta({ type: 'ObjectId', ref: 'TransactionType' }),
    from: mixed().required().meta({ type: 'ObjectId', ref: 'Card' }),
    gateway: mixed().meta({ type: 'ObjectId', ref: 'Organization' }),
    to: mixed().required().meta({ type: 'ObjectId', ref: 'Card' }),
    gross: number().required().integer().meta({
      validate: function (v) {
        return v === this.gatewayFee + this.vat + this.net
      }
    }),
    vat: number().required().integer().meta({
      validate: function (v) {
        return v === (this.gross * this.type.value) / 10000
      }
    }),
    gatewayFee: number().default(0).integer().meta({
      validate: function (v) {
        if (!this.gateway) {
          return v === 0
        }
        return v === (this.net * this.gateway.feeAsGateway) / 10000
      }
    }),
    net: number().required().integer().meta({
      validate: function (v) {
        return v === this.gross - this.vat - this.gatewayFee
      }
    }),
    status: string().required().oneOf(['pending', 'processed']),
    source: string().default('manual').oneOf(['manual', 'csv', 'data_sync']),
    originalTransaction: mixed().meta({
      type: 'ObjectId',
      ref: 'Transaction',
      description: 'In case this transaction originates from another recorded transaction (e.g.: refund), please use this field'
    }),
    invoice: string().meta({
      description: 'Link to a third-party invoice, if any'
    }),
    externalReference: string().meta({
      description: 'Reference ID to a third-party system'
    })
  })

exports.modelName = modelName
exports.name = name
exports.resourceType = toResourceType(name, schema)
exports.schema = schema
