    const jwt = require('jsonwebtoken');
    const userModel = require('../models/user')

exports.authenticate = async (req, res, next)=>{
    try {
        //Get the token from the request header
        const auth = req.header('Authorization')
        if(auth == undefined){
            return res.status(401).json({
                message: 'Token not found'
            })
        }
        const token = auth.split(' ')[1]

        if(token == undefined){
            return res.status(401).json({
                message: "Invalid Token"
            })
        }
        const decodedToken =await jwt.verify(token, process.env.SECRET)
        //check for the user and throw error if not found
        const user = await userModel.findById(decodedToken.userId);
        if(user == null){
            return res.status(404).json({
                message:"Authentication Failed: User not found"
            });
        }
        req.user = decodedToken;

        next();

    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            return res.status(401).json({
                message: "Session timed-out,please login to continue"
            })
        }
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error'
        }) 
    }
};

exports.adminAuth = async (req, res, next)=>{
    try{
        if(req.user.isAdmin == true){
            next()
        }else{
            res.status(403).json({
                message: "Unauthorized: Not an Admin"
            })
        }
    }catch(error){
        console.log(error.message)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

exports.superAdminAuth = async(req, res, next)=>{
    try {
        if(req.user.isSuperAdmin == true){
            next()
        }else{
            res.status(403).json({
                message: "Unathorized: You're not allowed to perform this action."
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
    
