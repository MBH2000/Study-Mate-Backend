const express = require ('express')
const User = require('../models/user')
const router = new express.Router()
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
router.post('/user/logout',async (req,res)=>{
    try {
        const user = await User.findOneAndUpdate({email: req.body.email},{token : ""})
        await user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})
//update user router
//get user info router 
module.exports = router