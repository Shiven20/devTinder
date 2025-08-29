const express= require("express")
const authRouter= express.Router()
const {validateSignUpData} = require("../utils/validation")
const User=require("../model/user")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")

authRouter.post("/signup", async (req, res) => {
  try {

    const { firstName, lastName, emailId, password, age, gender, photoURL, about, skills } = req.body;

    validateSignUpData(req)

    const passwordhash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
      age,
      gender,
      photoURL,
      about,
      skills,
    });

    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body
        const user= await User.findOne({emailId : emailId})
        if(!user){
            throw new Error("INVALID CREDENTIALS")
        }
        const ispasswordvalid= await user.verifyBcrypt(password)
        if(!ispasswordvalid){
            throw new Error("IINVALID CREDENTIALS")
        }else{
            const token = await user.getJWT()
            res.cookie("token",token,{expires: new Date(Date.now()+ 8*3600000)})
            res.send("user login successfully")
        }

    } catch(err){
        res.status(404).send("ERROR: " + err.message)
    }
})

authRouter.post("/logout",async(req,res)=>{
   res.cookie("token",null,{
    expires: new Date(Date.now())
   })
   res.send("logout successful")
})

module.exports=authRouter