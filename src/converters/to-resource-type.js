const a = {
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

function toResourceType(name, schema) {
  const { meta: { description } = {}, fields } = schema.describe()
  return {
    urlTemplates: {
      self: `/${name}/{id}`
    },
    info: {
      description,
      fields: Object.keys(fields).reduce((resourceTypeFields, schemaKey) => {
        const { meta: { description } = {} } = fields[schemaKey]
        if (description) {
          resourceTypeFields[schemaKey] = {
            description
          }
        }
        return resourceTypeFields
      }, {})
    }
  }
}

module.exports = toResourceType
