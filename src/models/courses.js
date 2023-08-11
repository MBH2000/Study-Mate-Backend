const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required:true
	},
	description: {
		type: String,
		required: true
	},
	totalTime: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		min: 0,
		max: 5
	},
	avatar: {
        type: Buffer
    },
	owner:{
		type: mongoose.Schema.Types.String,
		required: true,
		ref: 'User'
	}
})

const course = mongoose.model('course', productSchema)

module.exports = course