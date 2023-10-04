const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log("Database Connected.");
            mongoose.connection.on('disconnected',()=>{
            console.log(`Database disconnected`);
        });
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;