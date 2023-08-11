const express = require ('express')
const User = require('../models/user')
const multer = require('multer')
const router = new express.Router()
const auth = require('../middleware/auth')
const sharp = require('sharp')

//registr router
router.post('/user/register',async (req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.tokenm()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})
//login router 
router.post('/user/login',async (req,res)=>{
    try {
        const user = await User.login(req.body.email ,req.body.password)
        const token = await user.tokenm()
        res.send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})  
//logout router
router.post('/user/logout',auth,async (req,res)=>{
    try {
        req.user.token = req.user.token !== req.token
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/user/update',auth, async (req,res)=>{
    const update = Object.keys(req.body)
    const allowd = ['name','email','password' ,'number','about']
    const isVal = update.every((update)=> allowd.includes(update))

    if(!isVal){
        return res.status(400).send({error:'invalid'})
    }

    try {
        update.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/user/delete',auth,async(req,res)=>{
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/user/me',auth, async(req,res)=>{
    res.send(req.user)
})

const upload = multer({
    limits: {
        fieldSize: 100000 * 1024 * 1024
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('File must be jpg or jpeg or png'))
        }
        
        cb(undefined, true)
    }
})
router.post('/user/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 500, height: 500 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
module.exports = router