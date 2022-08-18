const express = require('express')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const multer = require('multer')

const router = new express.Router()

//Add product
router.post('/products',auth, async (req, res) => {
    const product = new Product({
        ...req.body,
        owner: req.user._id
    })

    try {
        await product.save()
        res.status(201).send({ product })
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/products', auth, async (req, res) => {
    res.send(req.product)
})


//Get product by id
router.get('/products/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        const product = await Product.findById(_id) 

        if (!product) {
            throw new Error('No result!')
        }

        res.send(product)
    } catch (e) {
        res.status(500).send()
    }
})

//Delete a specific product
router.delete('/products/:id',auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).send()
        }

        res.send(product)
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

router.post('/products/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    
    req.product.avatar = buffer
    await req.product.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router