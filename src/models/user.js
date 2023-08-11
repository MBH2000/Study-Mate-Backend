const mongoose = require('mongoose')
const validator =require('validator')
const bcryptjs =require('bcryptjs')
const jwt =require('jsonwebtoken')
const courses = require('./courses')
const { Timestamp, Int32 } = require('mongodb')

const UserSchema = new mongoose.Schema({
    name : {
        type:String,
        unique:true,
        required : true,
        trim : true
    },
    email:{
        type: String ,
        required: true,
        trim : true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is envalide')
            }
        }
    },
    password:{
        type : String,
        required : true,
        trim : true,
        minlength : 7,
    },
    token : {
        type: String
    },
    type : {
        type : String ,
        required : true 
    },
    avatar:{
        type:Buffer
    },
    number:{
        type: Number
    },
    id:{
        type:Number,
        unique:true
    },
    bio:{
        type: String
    },
    enrolled:[{
        courses:{
            type: String
        }
    }]
},{Timestamp : true})
UserSchema.virtual('courses',{
    ref : 'courses',
    localField :'name',
    foreignField:'owner'
})
UserSchema.methods.tokenm = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'tokensecretxo')
    user.token = token
    await user.save()
    return token
}
UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password , 8)
    }
    
    let randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    while (randomNumber % 10 === 0)
    { 
        randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    }
    user.id = randomNumber

    next()
})
UserSchema.statics.login = async (email , password)=>{
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('unable to login')
    }

    const ismatch = await bcryptjs.compare( password , user.password)
    if (!ismatch) {
        throw new Error('unable to login')
    }
    return user
}
UserSchema.methods.toJSON =  function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.token

    return userObject
}
UserSchema.pre('remove',async function (next){
    const user = this 
    next()
})

const User = mongoose.model('Users',UserSchema)
module.exports =User