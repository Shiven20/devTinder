const express= require("express")

const requestRouter = express.Router()
const {userAuth}= require("../middlewares/auth")
const {ConnectionRequestModel}= require("../model/connectionRequest")
const User= require("../model/user")
const { connection } = require("mongoose")

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId= req.user._id
        const toUserId= req.params.toUserId
        const status= req.params.status

        const allowedStatus=["ignored","interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type: " + status
            })
        }

        const touser= await User.findById(toUserId)
        if(!touser){
            return res.status(400).json({message:"User not found"})
        }

        const existingConnectionRequest = await ConnectionRequestModel.find({
            $or:[
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingConnectionRequest.length>0){
            return res.status(400).send({message:"Connection request already exists!!"})
        }

        const connectionRequest= new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        
        const data= await connectionRequest.save()

        res.json({
            message:"Connection request sent successfully",
            data,
        })
    } catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
    
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user
        const { status, requestId} = req.params

        const allowedStatus=["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status not allowed"})
        }
        const connectionRequest= await ConnectionRequestModel.findOne({
            fromUserId:requestId,
            toUserId: loggedInUser._id,
            status:"interested"
        })
        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found!!"})
        }
        connectionRequest.status=status
        const data=await connectionRequest.save()
        res.json({message:"connection request "+ status, data})
    } catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports=requestRouter