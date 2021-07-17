const mongoose = require('mongoose')

const resultSchema = mongoose.Schema({
	name: String,
	artist: String,
	imgSource: String,
})

resultSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Result', resultSchema)
