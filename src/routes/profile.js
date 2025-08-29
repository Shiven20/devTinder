const express= require("express")
const profileRouter= express.Router()
const {userAuth}= require("../middlewares/auth")
const {validateEditProfileData,validatePassword}= require("../utils/validation")
const User= require("../model/user")
const mongoose=require("mongoose")
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view",userAuth,async (req,res)=>{

    try{
    const user= req.user
    
    res.send(user)} catch(err){
        res.status(404).send("Error: " + err.message)
    }

})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try{if(!validateEditProfileData(req)){
    throw new Error("Invalid edit request")
  }
  const userLoggidIn=req.user

  Object.keys(req.body).forEach((key)=>(userLoggidIn[key]=req.body[key]))

  res.send(`${userLoggidIn.firstName}, your profile is updated successfully`)

  await userLoggidIn.save()


}catch(err){
    res.status(404).send("ERROR: "+ err.message)
  }
})

profileRouter.patch("/profile/edit/password",userAuth ,async(req,res)=>{
  try{
    if(!validatePassword(req)){
      throw new Error("You have requested only password change")
    }
            const { password, newPassword} = req.body
            
            const user = req.user
            const ispasswordvalid= await user.verifyBcrypt(password)
            if(!ispasswordvalid){
                throw new Error("INVALID CREDENTIALS")
            }else{
               const passwordhash = await bcrypt.hash(newPassword, 10);
                user.password= passwordhash
                await user.save()
                res.send("Password changed successfully")
            }
  } catch(err){
    res.status(400).send("ERROR: "+ err.message)
  }
})

module.exports= profileRouter  
