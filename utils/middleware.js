const logger = require('./logger')

const requestLogger = (request, response, next) => {
	logger.info('Method: ', request.method)
	logger.info('Path: ', request.path)
	logger.info('Body: ', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (request, response) => {
	response.json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error('This is the error: ', error.message)

	if (error.name === 'CastError') {
		response.status(400).send({
			error: 'malformatted error',
		})
	}
	next()
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
}
