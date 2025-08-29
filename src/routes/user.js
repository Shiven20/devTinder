const express = require("express")
const userRouter= express.Router()
const {userAuth}= require("../middlewares/auth")
const { ConnectionRequestModel } = require("../model/connectionRequest")

userRouter.get("/user/requests", userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user

        const connectionRequest=await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",["firstName","lastName"])

        res.json({
            message:"Data fetched successfully",
            data:connectionRequest
        })
    }catch(err){
        res.status(404).send("ERROR: " + err.message)
    }
})
userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user
        const connectionRequests= await ConnectionRequestModel.find({
            $or:[
                {fromUserId: loggedInUser._id, status:"accepted"},
                {toUserId: loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId",["firstName lastName"]).populate("toUserId",["firstName lastName"])
        const datauser= connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            message: "Here are your connections",
            data:datauser
        })

    } catch(err){
        res.status(400).send(err.message)
    }
})

module.exports={
    userRouter  
}