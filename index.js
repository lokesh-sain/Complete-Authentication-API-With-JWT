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
    res.json({
"Register Route":"https://login-register-jwt.onrender.com/auth/register/",
"Login Route":"https://login-register-jwt.onrender.com/auth/login/",
"Change Password Route": "https://login-register-jwt.onrender.com/auth/change-password/",
"Password Reset Request": "https://login-register-jwt.onrender.com/auth/reset-password/"
"Password Reset Submission": "https://login-register-jwt.onrender.com/auth/reset-password/"
});
});
app.get("*",(req,res)=>{
    res.json("404 Error Page");
});

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});
