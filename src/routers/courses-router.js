const express = require('express')
const auth = require('../middleware/auth')
const multer = require('multer')
const Course = require('../models/courses')


const router = new express.Router()

//Add course
router.post('/course',auth, async (req, res) => {
    const course = new Course({
        ...req.body,
        owner: req.user.name
    })

    try {
        await course.save()
        res.status(201).send({ course })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/course', async (req, res) => {
    const limit = req.query.limit
    const page =req.query.page
    try {
        const courses = await Course.find().limit(limit).skip(limit * page );
        return res.status(200).send({ courses });

    } catch (e) {
        return res.status(500).send({ Error: e })
    }
})


//Get course by id
router.get('/course/:id', async (req, res) => {
    const _id = req.params.id
    
    try {
        const course = await Course.findById(_id) 

        if (!course) {
            throw new Error('No result!')
        }

        res.send(course)
    } catch (e) {
        res.status(500).send()
    }
})

//Delete a specific product
router.delete('/course/:id',auth, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id)

        if (!course) {
            return res.status(404).send()
        }

        res.send(course)
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

router.post('/course/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    
    req.course.avatar = buffer
    await req.Course.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router