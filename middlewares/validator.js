// import joi dependency
const Joi = require('joi');


exports.registers = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).trim().pattern(/^\s*[A-Za-z ]+\s*$/).messages({
            'any.required': 'Fullname is required',
            "string.empty": "Fullname cannot be Empty",
"string.pattern.base":'Fullname should only contain alphabets',
'string.min':'Fullname should not be less than 3 letters'
        }).required(),
        email: Joi.string().email().trim().required().messages({
            'string.email':"invalid email format",
            "any.required":"Email is required",
             "string.empty": "Email cannot be Empty"
        }),
        password: Joi.string().pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/).min(6).trim().messages({
            "string.min":"password must be at least 6 characters",
            "any.required":"password is required",
             "string.empty": "password cannot be Empty",
             "string.pattern.base": 'password must be mininum of 8 character and include at least one Uppercase, lowercase and a special character [!!@#$%^&*]'
        }).required()
    })
    const {error} = schema.validate(req.body,{
        aboutEarly:false

    })
    if(error){
        return res.status(400).json({
            message:error.message
        })
    }
    next();
}

// // Import joi dependency
// const Joi = require('joi');

// exports.registers = (req, res, next) => {
//     const schema = Joi.object({
//         fullName: Joi.string()
//             .min(3)
//             .trim()
//             .pattern(/^\s*[A-Za-z]+\s*$/)
//             .messages({
//                 'any.required': 'Fullname is required',
//                 'string.empty': 'Fullname cannot be empty',
//                 'string.pattern.base': 'Fullname should only contain alphabets',
//                 'string.min': 'Fullname should not be less than 3 letters'
//             })
//             .required(),

//         email: Joi.string()
//             .email()
//             .required()
//             .messages({
//                 'string.email': 'Invalid email format',
//                 'any.required': 'Email is required'
//             }),

//         password: Joi.string()
//             .min(6)
//             .messages({
//                 'string.min': 'Password must be at least 6 characters',
//                 'any.required': 'Password is required'
//             })
//             .required()
//     });

//     // Validate the request body with schema
//     const { error } = schema.validate(req.body, {
//         abortEarly: false // Set abortEarly to false to get all validation errors
//     });

//     // If validation errors occur
//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message) // Return all error messages
//         });
//     }

//     // If validation passes, proceed to next middleware
//     next();
// };







