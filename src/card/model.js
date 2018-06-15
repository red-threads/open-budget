const mongoose = require('mongoose')
const pluralize = require('pluralize')
const { merge } = require('timm')
const { defaultSchema, options } = require('../schema')

const name = 'card'
const modelName = 'Card'
const schema = mongoose.Schema(merge(defaultSchema, {
  category: {
    type: String,
    enum: ['business', 'person'],
    required: true
  },
  name: {
    type: String,
    set: function () {
      if (this.category === 'person') {
        return `${this.given_name} ${this.family_name}`
      } else {
        return `${this.organization}`
      }
    }
  },
  givenName: {
    type: String,
    required: function () {
      return this.category === 'person'
    }
  },
  additionalName: {
    type: String
  },
  familyName: {
    type: String,
    required: function () {
      return this.category === 'person'
    }
  },
  nickname: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  photo: {
    type: String
  },
  url: {
    type: String
  },
  extendedAddress: {
    type: String
  },
  streetAddress: {
    type: String
  },
  locality: {
    type: String
  },
  region: {
    type: String
  },
  postalCode: {
    type: String
  },
  countryCode: {
    type: String,
    required: true,
    minlength: 2,
    maxlengh: 2
  },
  geoLatitude: {
    type: String
  },
  geoLongitude: {
    type: String
  },
  telephone: {
    type: String
  },
  notes: {
    type: String
  },
  birthday: {
    type: Date
  },
  publicKey: {
    type: String
  },
  organization: {
    type: String,
    required: function () {
      return this.category === 'business'
    }
  },
  role: {
    type: String
  },
  iban: {
    type: String,
    uppercase: true,
    minlength: 15,
    validate: function (v) {
      return this.currency ? !!v : true
    }
  },
  bic: {
    type: String,
    uppercase: true,
    minlength: 8,
    maxlengh: 11
  },
  currency: {
    type: String,
    enum: ['EUR', 'GBP'],
    validate: function (v) {
      return this.iban ? !!v : true
    }
  }
}), options)
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

exports.name = name
exports.pluralName = pluralize(name)
exports.modelName = modelName
exports.schema = schema
exports.model = mongoose.model(modelName, schema)
exports.resourceType = resourceType
