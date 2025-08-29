const mongoose=require("mongoose")

const connectDB= async ()=>{
    await mongoose.connect(
    "mongodb+srv://gargshiven046:f7ZGTcqYQ9JB7qc5@shivengarg.wgyuhqb.mongodb.net/devTinder"
)
}
module.exports=connectDB
