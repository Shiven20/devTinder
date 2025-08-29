const express = require("express")
const userRouter= express.Router()
const {userAuth}= require("../middlewares/auth")
const { ConnectionRequestModel } = require("../model/connectionRequest")
const { set } = require("mongoose")
const User= require("../model/user")
const USER_SAFE_DATA="firstName lastName photoURL age gender about skills"
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
userRouter.get("/user/feed", userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user

        const page= parseInt(req.query.page) || 1
        let limit= parseInt(req.query.limit) || 10
        limit=limit>50?50:limit
        const skip= (page-1)*limit

        const connectionRequests = await ConnectionRequestModel.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
        const hideUsersFromfeed= new Set()
        connectionRequests.forEach((req) => {
            hideUsersFromfeed.add(req.fromUserId.toString())
            hideUsersFromfeed.add(req.toUserId.toString())
        });

        const users= await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUsersFromfeed)}},
                {_id:{$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.send(users)
    }catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})

module.exports={
    userRouter  
}