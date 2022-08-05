const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner:{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post