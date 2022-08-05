const express = require('express')
const Post = require('../models/post')
const router = new express.Router()

//Create a post
router.post('/posts', async (req, res) => {
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

//Get posts?type=adoption
//Get /post?limit=10&skip=0
//Get /post?sortby=createdAt_asc or desc (1 or -1)
router.get('/posts', async (req, res) => {
    const sort = {}
    const match = {}

    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

    if(req.params.type) {
        match.type = req.params.type === "adoption"
    }

    try {
        await req.user.populate({
            path: 'posts',
            match,
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

//Get posts?type=sale
//Get /post?limit=10&skip=0
//Get /post?sortby=createdAt_asc or desc (1 or -1)
router.get('/posts', async (req, res) => {
    const sort = {}
    const match = {}

    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

    if(req.params.type) {
        match.type = req.params.type === "sale"
    }

    try {
        await req.user.populate({
            path: 'posts',
            match,
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

//Get specific post by its owner
router.get('/posts/:id', async (req, res) =>{
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

//Update a post by its owner
router.patch('/posts/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description']
    const isValideOperation = updates.every((update) =>  allowedUpdates.includes(update))

    if(!isValideOperation) {
        res.status(400).send({error: 'invalid updated'})
    }

    try {
        const post = await Post.findOne({_id: req.params.id, owner: req.user._id})
        
        if(!post) {
            return res.status(404).send()
        }
        updates.forEach((update) => post[update] = req.body[update])
        await post.save()
        res.send(post)
    } catch (e) {
        res.status(400).send(e)
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
//get specifc post 

module.exports = router