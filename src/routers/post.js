const express = require('express')
const Post = require('../models/post')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

//Create a post
router.post('/posts',auth, async (req, res) => {
    const post = new Post({
        ...req.body,
        owner: req.user._id
    })

    try {
       await post.save() 
       res.status(201).send(post)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/posts', auth, async (req, res) => {
    const sort = {}

    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

    try {
        await req.user.populate({
            path: 'posts',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.posts)
    } catch (e) {
        res.status(500).send()
    }
})
router.get('/posts/:id', auth, async (req, res) =>{
    const _id= req.params.id

    try {
        const post = await Post.findOne({_id, owner: req.user._id})
        if(!post) {
            return res.status(404).send()
        } else {
            res.send(post)
        }
    } catch (e) {
        res.status(500).send()
    }
})
//Delete a post by its owner
router.delete('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({_id:req.params.id, owner: req.user._id})

        if(!post) {
            res.status(404).send()
        }

        res.send(post)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('File must be jpg or jpeg or png'))
        }
        
        cb(undefined, true)
    }
})

router.post('/posts/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    
    req.post.avatar = buffer
    await req.post.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router