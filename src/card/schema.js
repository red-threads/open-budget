const { string, object, date } = require('yup')

const toResourceType = require('../converters/to-resource-type')

const modelName = 'Card'
const name = 'card'

const schema = object()
  .meta({
    description: 'Address and contact information for a company, person, organization. It tries to mimick the format available at http://microformats.org/wiki/h-card',
    name
  })
  .shape({
    category: string().required().oneOf(['business', 'person']),
    name: string().required(),
    givenName: string(),
    additionalName: string(),
    familyName: string(),
    nickname: string(),
    email: string().required().email(),
    logo: string(),
    photo: string(),
    url: string(),
    extendedAddress: string(),
    streetAddress: string(),
    locality: string(),
    region: string(),
    postalCode: string(),
    countryCode: string().required().length(2).matches(/^[A-Z]{2}$/),
    geoLatitude: string(),
    geoLongitude: string(),
    telephone: string(),
    notes: string(),
    birthday: date(),
    publicKey: string(),
    organization: string(),
    role: string(),
    iban: string().min(15)
      .label('Account\'s IBAN')
      .meta({
        description: 'IBAN is needed in case of a card attached to an organization!'
      }),
    bic: string().min(8).max(11)
      .label('BIC/Swift code')
      .meta({
        description: 'IBAN is usually enough, unless we deal with non-Euro currencies (and non-SEPA IBANs)'
      }),
    currency: string().oneOf(['EUR', 'GBP'])
      .default('EUR')
      .label('Account currency')
  })

exports.modelName = modelName
exports.name = name
exports.resourceType = toResourceType(name, schema)
exports.schema = schema
