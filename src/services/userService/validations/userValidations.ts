import Joi from "joi"

const RegisterValidation = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    accountName: Joi.string().min(3).max(30).required(),
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    password: Joi.string().trim().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
        .required()
});

const LoginValidation = Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    password: Joi.string().trim().min(8).required()
    // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8, }$'))
})

const VerifyOtpValidation = Joi.object({
    otp: Joi.string().min(6).max(6).required().messages({
        "string.min": "OTP must be 6 digits long",
        "string.max": "OTP must be 6 digits long",
        "any.required": "OTP is required"
    })
})

const ResetPassValidation = Joi.object({
    password: Joi.string().trim().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
        .required()
})
export default {
    RegisterValidation,
    LoginValidation,
    VerifyOtpValidation,
    ResetPassValidation
}