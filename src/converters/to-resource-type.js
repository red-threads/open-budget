const { host } = require('../host')

function toResourceType (name, schema) {
  const { meta: { description } = {}, fields } = schema.describe()
  return {
    urlTemplates: {
      self: `${host}/${name}/{id}`
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
