import Joi from "joi"

const RegisterValidation = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    accountName: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
        .required()
});

const LoginValidation = Joi.object({

})

export default {
    RegisterValidation,
    LoginValidation,
}