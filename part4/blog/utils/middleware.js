const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  return response.status(404).json({ erro: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}
