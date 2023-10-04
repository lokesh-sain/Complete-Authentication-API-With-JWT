const jwt = require("jsonwebtoken");

const authUser = async (request,response,next) =>{
    const token = request.header("Authorization");
    if(!token){
        return response.status(401).json({error:"Please authenicate using a valid token"});
    }
    try{
        const userData = jwt.verify(token,process.env.JWT_SECRET_KEY);
        request.user = userData;
        next();
    }catch(error){
        return response.status(401).json({error:"Please authenicate using a valid token"});
    }
}

module.exports = authUser;