const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	response.json(
		await User.find({}).populate('playlist_items', {
			artist: 1,
			name: 1,
			imgSource: 1,
		})
	)
})

usersRouter.delete('/all', async (request, response) => {
	response.json(await User.deleteMany({}))
})

usersRouter.post('/', async (request, response) => {
	const body = request.body

	const saltRounds = 10

	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash,
	})

	const savedUser = await user.save()
	response.json(savedUser)
})

usersRouter.post('/login', async (request, response) => {
	const body = request.body

	const user = await User.findOne({ username: body.username })
	const passwordCorrect =
		user !== null
			? await bcrypt.compare(body.password, user.passwordHash)
			: false

	if (!(user && passwordCorrect)) {
		response.status(401).send({
			error: 'missing or invalid credentials',
		})
	}

	const userForToken = {
		username: user.username,
		name: user.name,
		id: user._id,
	}

	const token = jwt.sign(userForToken, process.env.SECRET)

	response.json({ token, username: user.username, name: user.name })
})

module.exports = usersRouter
