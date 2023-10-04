const router = require("express").Router();
const {handleUserLogin,handleUserRegister,handleChangePassword,handleResetPassword,sendUserPasswordResetMail} = require("../controller/auth_Controller");

const {validateUser,validateLogin,changePasswordValidations,passwordResetValidation,passwordUpdateValidation} = require("../middleware/validations") // Middleware for server-side validations
const authUser = require("../middleware/authentication") //middleware

//Public Routes
router.post("/register",validateUser,handleUserRegister);
router.post("/login",validateLogin,handleUserLogin);

//Protected Routes
router.post("/change-password",authUser,changePasswordValidations,handleChangePassword);
router.post("/reset-password",passwordResetValidation,sendUserPasswordResetMail); //This will send a email to reset password
router.post("/reset-password/:id/:token",passwordUpdateValidation,handleResetPassword);

module.exports = router;