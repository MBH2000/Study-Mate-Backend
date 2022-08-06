const express = require ('express')
const User = require('../models/user')
const router = new express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    user:
 *      type:object
 *      required:
 *       -   name
 *       -  email
 *       - password
 *       - type
 *      properties:
 *          name :
 *              type : string
 *              description : name of the account
 *          email :
 *              type : string
 *              description : email of the user
 *          password :
 *              type : string
 *              description : min length 7
 *          type :
 *              type : string
 *               description : store or normel user
 *  
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

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