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
	price: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		min: 0,
		max: 10
	},
	quantity: {
		type: Number,
		required: true,
	},
	avatar: {
        type: Buffer
    },
	owner:{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
})

const Product = mongoose.model('Products', productSchema)

module.exports = Product