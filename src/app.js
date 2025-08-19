const express=require("express");

const app=express();

app.use("/hehe",(req,res)=>{
    res.send("Hello fohe server ")
})

app.listen(3000,()=>{
    
})
