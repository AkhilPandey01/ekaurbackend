import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowecase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowecase:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //coloudinary url
        required:true
    },
    coverimage:{
        type:String //coloudinary url
    },
    password:{
        type:String,
        required:[true,"Please provide password"], //required:true
    },
    watchHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    referenceToken:{
        type:String,
        default:null
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.modified("password")) return next()
    this.password=bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.comparePassword=async function(candidatePassword){
    return bcrypt.compare(candidatePassword,this.password)
}

userSchema.methods.generateAccessToken=async function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:"1d"
    }
    )

}

userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:"10d"
    }
    )
}

export const User=mongoose.model("user",userSchema) // export User