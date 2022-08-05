const express = require('express')
const Product = require('../models/product')
//const auth = require('../middleware/auth')
const router = new express.Router()

//Add product
router.post('/products', async (req, res) => {
    const product = new Product(req.body)

    try {
        await product.save()
        res.status(201).send({ product })
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get all products
//10 products 
router.get('/products', async (req, res) => {
    res.send(req.product)
})

//Get products by name
//by type ********
router.get('/products/:name', async (req, res) => {
    const name = req.params.name

    try {
        const product = await Product.find({name})

        if (!product) {
            throw new Error('No result')
        }

        res.send(product)
    } catch (e) {
        res.status(500).send()
    }
})

//Get product by id
router.get('/products/:id', async (req, res) => {
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

//Update the price or quantity of a specified product 
router.patch('/products/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['price', 'quantity']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const product = await Product.findById(req.params.id)

        updates.forEach((update) => product[update] = req.body[update])
        await product.save()

        if (!product) {
            return res.status(404).send()
        }

        res.send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete a specific product
router.delete('/products/:id', async (req, res) => {
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