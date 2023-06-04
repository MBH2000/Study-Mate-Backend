const express = require ('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

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
    const allowd = ['name','emai','password']
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
module.exports = router