const mongoose = require('mongoose')
const validator =require('validator')
const bcryptjs =require('bcryptjs')
const jwt =require('jsonwebtoken')
const { Timestamp } = require('mongodb')
const Post = require('./post')
const Product = require('./product')

//pleas connect the post model here  for authentication

const UserSchema = new mongoose.Schema({
    name : {
        type:String,
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
        //not a list of token because we will not allow multi session 
    },
    type : {
        type : String ,
        required : true 
    },
    avatar:{
        type:Buffer
    }
},{Timestamp : true})
UserSchema.virtual('Post',{
    ref : 'Post',
    localField :'_id',
    foreignField:'owner'
})
UserSchema.virtual('Product',{
    ref : 'Product',
    localField :'_id',
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
    await Post.deleteMany({owner: user.id})
    await Product.deleteMany({owner: user.id})
    next()
})
const User = mongoose.model('Users',UserSchema)

module.exports =User