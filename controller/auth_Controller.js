const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../services/emailService");


//ValidationResult is inbuilt function of express validator which extract the errors if there.

const handleUserRegister = async (request, response) => {
    const checkErrors = validationResult(request);
    if (!checkErrors.isEmpty()) {
        const error = checkErrors.array().map(obj => obj.msg) //This will extract the msg fields only
        return response.status(403).json(error)
    }
    try {
        const { name, email, password } = request.body; // De-Structuring
        let emailCheck = await User.findOne({ email: email });
        if (emailCheck) {
            return response.status(403).json({ "status": "failed", message: "Another account is using the same email" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);
        const registerUser = await User.create({ name, email, password: hashPassword }); //Saving data of new user

        //Token Prepations
        const payload = { id: registerUser.id, comment: "Don't try to be oversmart" };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });

        registerUser ? response.status(200).json({ "Authenication-Token": authToken }) : response.status(500).json({ "status": "failed", "message": "internal server error" });
    }
    catch (error) {
        response.status(400).json({ "status": "failed", "message": error })
    }
}

const handleUserLogin = async (request, response) => {
    const checkErrors = validationResult(request);
    if (!checkErrors.isEmpty()) {
        const error = checkErrors.array().map(obj => obj.msg) //This will extract the msg fields only
        return response.status(403).json(error)
    }
    try {
        const { email, password } = request.body;
        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            return response.status(400).json({ errors: "Please try to login with correct credentials." });
        }
        const comparePassword = await bcrypt.compare(password, checkUser.password);
        if (!comparePassword) {
            return response.status(400).json({ errors: "Please try to login with correct credentials." });
        }

        //Token Prepations
        const payload = { id: checkUser.id, comment: "Don't try to be oversmart" };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
        response.status(200).json({ "Authenication-Token": authToken })

    }
    catch (error) {
        response.status(400).json({ "status": "failed", "message": error })
    }
}

const handleChangePassword = async (request, response) => {
    const checkErrors = validationResult(request);
    if (!checkErrors.isEmpty()) {
        const error = checkErrors.array().map(obj => obj.msg) //This will extract the msg fields only
        return response.status(403).json(error)
    }
    try {
        const userId = request.user.id;
        const { oldPassword, newPassword } = request.body;
        const userData = await User.findById(userId).select('password');
        const compareWithOldPassword = await bcrypt.compare(oldPassword, userData.password);
        const newPasswordCompareWithOld = await bcrypt.compare(newPassword, userData.password);

        if (!compareWithOldPassword) {
            return response.status(400).json({ errors: "Old password is incorrect" });
        } else if (newPasswordCompareWithOld) {
            // We will check if user is trying to enter newpassword same as old password
            return response.status(400).json({ errors: "New password cannot be the same as old" });
        } else {
            const salt = await bcrypt.genSalt(12);
            const newHashPassword = await bcrypt.hash(newPassword, salt);
            const savedNewPassword = await User.findByIdAndUpdate(userId, { $set: { password: newHashPassword } })
            return savedNewPassword ? response.status(200).json({ "status": "success", "message": "password changed sucessfully" }) : response.status(500).json({ "status": "failed", "message": "internal server error" })
        }
    } catch (error) {
        response.status(400).json({ "status": "failed", "message": error })
    }
}

const sendUserPasswordResetMail = async (request, response) => {
    const checkErrors = validationResult(request);
    if (!checkErrors.isEmpty()) {
        const error = checkErrors.array().map(obj => obj.msg) //This will extract the msg fields only
        return response.status(403).json(error)
    }
    try {
        const userEmail = request.body.email;
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return response.status(200).json({ "status": "success", "message": "You may receive an email from us regarding a password reset on your account" });
        } else {
            const secret = (user.id + process.env.JWT_SECRET_KEY);
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '15m' });

            const resetLink = `${process.env.APP_BASE_URL}/auth/reset-password/${user.id}/${token}`; // FrontEnd Part
            console.log(resetLink);
            //Send Mail
             await transporter.sendMail({
                from: process.env.MAIL_USER, // sender address
                to: user.email, // list of receivers
                subject: "Application Name - Reset Your Password ✔", // Subject line
                text: "Do Not Share This Email With Anyone Else", // plain text body
                html: `<a href=${resetLink}>Click Here</a> To reset your password.`, // html body
              });
            return response.status(200).json({ "status": "success", "message": "You may receive an email from us regarding a password reset on your account" });
        }
    } catch (error) {
        response.status(400).json({ "status": "failed", "message": error })
    }
}

const handleResetPassword = async (request, response) => {
    const checkErrors = validationResult(request);
    const userId = request.params.id;
    const token = request.params.token;
    if (!checkErrors.isEmpty()) {
        const error = checkErrors.array().map(obj => obj.msg) //This will extract the msg fields only
        return response.status(403).json(error);
    }
    try {
        if (userId && token) {
            const newPassword = request.body.password;
            const secret = (userId + process.env.JWT_SECRET_KEY);
            const verifyToken = await jwt.verify(token, secret);
            if (verifyToken && verifyToken.userId === userId) {
                const salt = await bcrypt.genSalt(12);
                const newHashPassword = await bcrypt.hash(newPassword, salt);
                const savedNewPassword = await User.findByIdAndUpdate(userId, { $set: { password: newHashPassword } })
                return savedNewPassword ? response.status(200).json({ "status": "success", "message": "password changed sucessfully" }) : response.status(500).json({ "status": "failed", "message": "internal server error" })
            }
        }
        return response.status(200).json({ "status": "success", "message": "Please request a new email for password reset" });
    } catch (error) {
        response.status(200).json({ "status": "failed", "message": "token expired" })
    }
}

module.exports = { handleUserRegister, handleUserLogin, handleChangePassword, handleResetPassword, sendUserPasswordResetMail }