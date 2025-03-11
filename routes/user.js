const userRouter = require ('express').Router()

const { register,verifyUser,resendVerificationemail,login,getAllUser } = require('../controller/user')
const {authenticate}= require('../middlewear/authentication')

userRouter.post('/users',register);
userRouter.get('/verify-user/:token', verifyUser);
userRouter.post('/login',login);
userRouter.get('/user',authenticate,getAllUser)

// userRouter.post('/resend-verification',resendVerificationemail)
module.exports = userRouter