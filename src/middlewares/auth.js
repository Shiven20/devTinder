const jwt=require("jsonwebtoken")
const User=require("../model/user")

const userAuth= async(req,res,next)=>{
    try{
    const cookie=req.cookies

    const {token}=cookie
    if(!token){
        return res.status(401).send("Please login!!")
    } 
    const decodedObj=await jwt.verify(token,"Preeti@1982")
    const {_id} =decodedObj

    const user= await User.findById(_id)
    if(!user){
        throw new Error("User not found")
    } 
    req.user=user
    next()
    } catch(err){
        res.status(400).send("Error: "+ err.message)
    }
   
}
module.exports={
    userAuth 
}