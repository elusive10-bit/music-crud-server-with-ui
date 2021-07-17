const jwt = require('jsonwebtoken')
const resultsRouter = require('express').Router()
const Result = require('../models/result')
const Playlist = require('../models/playlist')

let results = [
	{
		id: 1,
		name: 'Gallows Bell',
		artist: 'Vocaloid',
		imgSource: 'images/icon.svg',
		color: '#683025ff',
		lightFont: true,
	},
	{
		id: 2,
		name: 'Glow',
		artist: 'Vocaloid',
		imgSource: 'images/icon2.svg',
		color: '#855ec6ff',
		lightFont: true,
	},
	{
		id: 3,
		name: 'Hysteria',
		artist: 'Vocaloid',
		imgSource: 'images/icon3.svg',
		color: '#5ec3c6ff',
		lightFont: true,
	},
	{
		id: 4,
		name: 'Mirai e',
		artist: 'Unknown',
		imgSource: 'images/icon4.svg',
		color: '#b67855ff',
		lightFont: true,
	},
	{
		id: 5,
		name: 'Crossroads',
		artist: 'Vocaloid',
		imgSource: 'images/icon5.svg',
		color: '#b65599ff',
		lightFont: false,
	},
	{
		id: 6,
		name: 'Now or Never',
		artist: 'Vocaloid',
		imgSource: 'images/icon6.svg',
		color: '#5ca7a9ff',
		lightFont: false,
	},
	{
		id: 7,
		name: 'Magenta',
		artist: 'Vocaloid',
		imgSource: 'images/icon7.svg',
		color: '#7a7a7aff',
		lightFont: false,
	},
]

const getTokenFrom = (request) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	null
}

resultsRouter.get('/', async (request, response) => {
	const savedResults = await Result.find({}).populate('users', {
		username: 1,
		name: 1,
	})
	response.json(savedResults)
})

resultsRouter.get('/:id', async (request, response) => {
	const token = getTokenFrom(request)
	const decodedToken = jwt.verify(token, process.env.SECRET)

	const savedResult = await Playlist.find({
		playlist_items: request.params.id,
		user: decodedToken.id,
	}).populate('playlist_items', { name: 1, artist: 1 })

	response.json(savedResult)
})

resultsRouter.delete('/all', async (request, response) => {
	const responseData = await Result.deleteMany({})

	response.json(responseData)
})

resultsRouter.post('/all', async (request, response) => {
	const responseData = await Result.insertMany(results)
	response.json(responseData)
})

module.exports = resultsRouter
