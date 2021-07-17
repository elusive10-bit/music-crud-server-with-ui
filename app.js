const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('express-async-errors')

const resultsRouter = require('./controllers/results')
const playlistItemsRouter = require('./controllers/playlist')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')

mongoose
	.connect(config.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		logger.info('connected to db')
	})
	.catch((error) => {
		logger.error('db error: ', error.message)
	})

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use(middleware.requestLogger)
app.use('/api/results', resultsRouter)
app.use('/api/playlist', playlistItemsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
