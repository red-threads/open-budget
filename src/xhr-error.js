function errorHandler (error) {
  let errorObject
  if (error.response) {
    errorObject = new Error(`Server replied with a ${error.response.status} status.
    Data:
    ${JSON.stringify(error.response.data)}
    
    Headers:
    ${JSON.stringify(error.response.headers)}

    Configuration:
    ${JSON.stringify(error.config)}
    `)
  } else if (error.request) {
    errorObject = new Error(`Request error.\nMore infos: ${JSON.stringify(error.request)}`)
  } else {
    errorObject = new Error(`Configuration error: ${error.message}`)
  }
  console.error(errorObject)
  return errorObject
}

module.exports = errorHandler
