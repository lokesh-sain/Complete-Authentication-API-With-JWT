const express = require("express");
const app = express();
const connectDB = require("./config/dbConnection");
const cors = require("cors");


//variables
const PORT = process.env.PORT || 3000;


//Middlewares
require("dotenv").config();
app.use(cors());
app.use(express.json());
connectDB();


app.use("/auth",require("./routes/auth_Routes"));

app.get("/",(req,res)=>{
    res.json("Landing page");
});
app.get("*",(req,res)=>{
    res.json("404 Error Page");
})

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
})