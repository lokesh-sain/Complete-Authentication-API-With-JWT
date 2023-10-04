const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
    name:{type:String,required:[true,"name is required"],max:[20,"Max 16 Characters."],trim:true},
    email:{type:String,
    required:[true,"email is required"],
    unique:[true,"email already exits"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    password:{type:String,required:[true,"Password is required"]},
    date:{type:Date,default:Date.now}
});

const User = mongoose.model('users',UserModel);
module.exports = User;