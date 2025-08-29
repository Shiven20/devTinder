const mongoose = require("mongoose")
const validator= require("validator")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema({
 firstName: {
    type: String,
    required:true,
    minLength:3,
    maxLength:50,
    trim:true,
    validate(value){
      if(!validator.isAlpha(value)){
         throw new Error("Enter a valid name")
      }
    }
 },
 lastName: {
    type: String,
    minLength:3,
    maxLength:10,
    trim:true,
    validate(value){
      if(!validator.isAlpha(value)){
         throw new Error("Enter a valid name")
      }
    }
 },
 emailId: {
    type: String,
    lowercase:true,
    required: true,
    unique:true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value)){
         throw new Error("incorrect email: " + value)
      }
    }
 },
 password: {
    type: String,
    required:true,
     
    minLength:8
 },
 age:{  
    type:Number,
    min:18,
    required:true
 },
 gender: {
    type: String,
    validate(value){
     if(!["male","female","others"].includes(value)){
     throw new Error("Gender is not valid")
     }
    }
 },
 photoURL:{
   type: String,
   default: "https://www.google.com/imgres?q=dummy%20user%20full%20photo%20image&imgurl=https%3A%2F%2Fwww.scl.gov.in%2Fimg%2Fdummy.jpg&imgrefurl=https%3A%2F%2Fwww.scl.gov.in%2Fmc.html&docid=pfH1O5bhYQqmIM&tbnid=mVP4bb3dw78eXM&vet=12ahUKEwjvrc2UypyPAxWSzzgGHbkgIhsQM3oECCYQAA..i&w=380&h=380&hcb=2&ved=2ahUKEwjvrc2UypyPAxWSzzgGHbkgIhsQM3oECCYQAA",
    validate(value){
      if(!validator.isURL(value)){
         throw new Error("incorrect photoURL: " + value)
      }
    }
 },
 about:{
   type: String,
   default:"Enter about yourself",
   maxLength:200
 },
 skills:{
   type:[String],
   required: true,
   minLength:1,
   maxLength:10
 }
},{
   timestamps:true
})
userSchema.methods.getJWT = async function(){
   const user=this
    const token=await jwt.sign({_id:this._id},"Preeti@1982",{
                expiresIn : "1d",
   })
   return token
}
userSchema.methods.verifyBcrypt = async function(passwordInputByUser){
   const user=this
   const passwordhash=user.password
   const ispasswordvalid= await bcrypt.compare(passwordInputByUser,passwordhash)
   return ispasswordvalid
}
module.exports= mongoose.model("User", userSchema)