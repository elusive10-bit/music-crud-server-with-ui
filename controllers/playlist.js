const jwt = require('jsonwebtoken')
const playlistRouter = require('express').Router()
const Playlist = require('../models/playlist')
const User = require('../models/user')
const Result = require('../models/result')

const getTokenFrom = (request) => {
	const authorization = request.get('authorization')

	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

playlistRouter.get('/all', async (request, response) => {
	response.json(await Playlist.find({}))
})

playlistRouter.get('/', async (request, response) => {
	const token = getTokenFrom(request)
	const decodedToken = jwt.verify(token, process.env.SECRET)

	response.json(
		await Playlist.find({ user: decodedToken.id }).populate('playlist_items', {
			name: 1,
			artist: 1,
		})
	)
})

playlistRouter.delete('/', async (request, response) => {
	const token = getTokenFrom(request)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	response.json(await Playlist.deleteMany({ user: decodedToken.id }))
})

playlistRouter.delete('/:id', async (request, response) => {
	response.json(await Playlist.findByIdAndRemove(request.params.id))
})

playlistRouter.delete('/all', async (request, response) => {
	response.json(await Playlist.deleteMany({}))
})

playlistRouter.put('/:id', async (request, response) => {
	const body = request.body
	const playlist = await Playlist.findById(body.playlist_id)

	playlist.playlist_items = playlist.playlist_items.filter((item) =>
		item.toString() !== request.params.id ? item : null
	)
	playlist.save()

	response.json(playlist)
})

playlistRouter.post('/', async (request, response) => {
	const body = request.body
	const token = getTokenFrom(request)

	const decodedToken = jwt.verify(token, process.env.SECRET)

	const user = await User.findById(decodedToken.id)

	const duplicatePlaylistName = await Playlist.findOne({ user: user.id })
	if (duplicatePlaylistName !== null) {
		if (duplicatePlaylistName.name === body.name) {
			response.status(400).end()
		} else {
			const newPlaylist = new Playlist({
				name: body.name,
				user: user.id,
			})
			response.json(await newPlaylist.save())
		}
	} else {
		const newPlaylist = new Playlist({
			name: body.name,
			user: user.id,
		})
		response.json(await newPlaylist.save())
	}
})

playlistRouter.put('/result/:id', async (request, response) => {
	const body = request.body
	console.log(body.playlist_id)
	const playlist = await Playlist.findById(body.playlist_id)
	const result = await Result.findById(request.params.id)
	playlist.playlist_items = playlist.playlist_items.concat(result)
	response.json(await playlist.save())
})

module.exports = playlistRouter
