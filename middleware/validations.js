const { body } = require('express-validator');

//validations 

const validateUser =
    [
        body('name', 'Enter a valid name').isLength({ min: 2, max: 20 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long')
    ]

const validateLogin =
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password is required').not().isEmpty()
    ]

const changePasswordValidations =
    [
        body('oldPassword', 'Old Password is required').not().isEmpty(),
        body('newPassword', 'Enter a new Password').not().isEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 chars long')
    ]

const passwordResetValidation =
    [
        body('email', 'Enter a valid email').isEmail()
    ]

const passwordUpdateValidation =
    [
        body('password', 'Enter a new Password').not().isEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 chars long')
    ]

module.exports = { validateUser, validateLogin, changePasswordValidations, passwordResetValidation, passwordUpdateValidation }