const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../helper/nodemailer');
const signup = require('../helper/signup')

exports.register = async(req, res)=>{
    try {
        // Extract required fields fron the request body
        const { fullName, email, password} = req.body;
        //check if user email exist
        const userExists = await userModel.findOne({ email: email.toLowerCase().trim()})

        if(userExists){
            return res.status(400).json({
                message: `Email: ${email} already in use`
            })
        };
        //Salt and Hash the User's password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create an instance of the User document
        const user = userModel({
            fullName:fullName.trim(),
            email:email.trim(),
            password: hashedPassword
        });
        //Genrate a token
        const token = await jwt.sign({userId: user._id}, process.env.SECRET, {expiresIn: '10mins'})
        //create the verify link with the token generated
        const link = `${req.protocol}://${req.get('host')}/verify-user/${token}`
        const firstName = user.fullName.split(' ')[0];
        //Create the email details
        const mailDetails = {
            email: user.email,
            subject: 'Welcome to AI podcast',
            html: signup(link, firstName)
        };
        //Save the user document to database
        // await user.save();
        //await nodemailer to send the email
        await sendEmail(mailDetails)
        //Send a success response
        res.status(200).json({
            message: 'User registerd successfully',
            data: user
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error'
        })
        
    }
};

// exports.verifyUser = async(req, res)=>{
//     try {
//         //Get the token from the params
//     const {token} = req.params;
//     // Verify the token
//    const decodedToken = await jwt.verify(token, process.env.SECRET);
//    console.log(decodedToken)
//    // Find the user in the database
//    const user = await userModel.findById(decodedToken.userId);
//    console.log(user)
//    //Check if user still exists
//    if(user === null){
//     return res.status(404).json({
//         message: "User not found"
//     })
//    };
//    // Check if the user has already been verified
//    if(user.isVerified === true){
//     return res.status(400).json({
//         message: "User has already been verified, Please prpceed to login"
//     })
//    };
//    //Verify the user account
//    user.isVerified = true;
//    //save the changes to the database
//    await user.save();
//    // Send a succcess response
//    res.status(200).json({
//     message: "Account Verified Successfully"
//    });
        
//     } catch (error) {
//         console.log(error.message)
//         if(error instanceof jwt.TokenExpiredError){
//             return res.status(400).json({
//                 message: "Verification Link expired please resend a new Link"
//             })
//         }
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// };

// exports.verifyUser = async(req, res)=>{
//     try {
//         //Get the token from the params
//     const {token} = req.params;
//     // Verify the token
//    const decodedToken = await jwt.verify(token, process.env.SECRET);
//    // Find the user in the database
//    const user = await userModel.findById(decodedToken.userId);
//    //Check if user still exists
//    if(user === null){
//     return res.status(404).json({
//         message: "User not found"
//     })
//    };
//    //Verify the user account
//    user.isVerified = true;
//    //save the changes to the database
//    await user.save();
//    // Send a succcess response
//    res.status(200).json({
//     message: "Account Verified Successfully"
//    });
   
        
//     } catch (error) {
//         console.log(error.message)
//         if(error instanceof jwt.TokenExpiredError){
//             return res.status(400).json({
//                 message: "Verification Link expired please resend a new Link"
//             })
//         }
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// };

// exports.resendVerificationEmail = async(req,res)=>{
//     try {
//         //Extract the user's email from the req body
//         const {email} = req.body;
//         if(!email){
//             return res.status(400).json({
//                 message: 'Please enter Email Address'
//             })
//         };
//         //find the user and confirm if the user exists
//         const user = await userModel.findOne({email: email.toLowerCase()})
//         if(user === null){
//             return res.status(400).json({
//                 message: 'User not found'
//             })
//         };
//         /// Check if the user has already been verified
//         if(user.isVerified === true){
//             return res.status(400).json({
//                 message:"User has already been verified, proceed to login"
//             })
//         }
//         // Generate a token for the user
//         const token = await jwt.sign({userId: user._id}, process.env.SECRET, {expiresIn: '10mins'})
//         //create the verify link with the token generated
//         const link = `${req.protocol}://${req.get('host')}/verify-user/${token}`
//         const firstName = user.fullName.split(' ')[0];
//         //Create the email details
//         const mailDetails = {
//             email: user.email,
//             subject: 'Verification link',
//             html: signup(link, firstName)
//         };
//         //Await nodemailer to send the email
//         await sendEmail(mailDetails)

//         //Send a sucess response
//         res.status(200).json({
//             message:"New verification link sent please check your email"
//         })
//     } catch (error) {
//         console.log(error.message)
//         res.status(500).json({
//             message: 'Internal Server Error'
//         }) 
//     }
// };

exports.verifyUser = async (req,res)=>{
    try {
        //Get the token from the params
        const {token} = req.params;
        //verify the token
        await jwt.verify(token, process.env.SECRET, async (error,payload)=>{
        if(error){
            //Check if error is jwt expires error
            if(error instanceof jwt.TokenExpiredError){
                const decodedToken = await jwt.decode(token);
                //Check for user
                const user = await userModel.findById(decodedToken.userId);
                if(user == null){
                    return res.status(404).json({
                         message: "User not found"
                    })
                }
                //check if the user has already been verified
                if (user.isVerified === true){
                    return res.status(400).json({
                        message:'User has already been verified, pleaase prpceed to login'
                    })
                }
                //Generate a new token
                const newToken = await jwt.sign({userId: user.id}, process.env.SECRET, {expiresIn: '3mins'})
                //Dynamically create the link
                const link = `${req.protocol}://${req.get('host')}/verify-user/${newToken}`
                //Get the user's first name
                const firstName = user.fullName.split(' ')[0];
                //Create the email details
                const mailDetails = {
                    email: user.email,
                    subject: 'Email verification',
                    html: signup(link, firstName)
                }
                //Await nodemailer to send the email
                await sendEmail(mailDetails);
                //send a success response
                res.status(200).json({
                    message:'Link expired: A new verification link was sent, please check your email'
                })

            }
        }else{
            console.log(payload)
            //Find the user in database
            const user = await userModel.findById(payload.userId);
            //Check if user still exists
            if(user === null){
                return res.status(404).json({
                    message:"user not found"
                })
            };
            //check if the user has already been verified
            if(user.isVerified === true){
                return res.status(400).json({
                    message:"User has already been verified, please proceed to login"
                })
            }
            //verify thr user account
            user.isVerified = true;
            //save the changes to the database
            await user.save();
            //send a success response
            res.status(200).json({
                message: "Account verified succeffully"
            })

        }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error'
        })
        
    }
}

exports.login = async(req, res)=>{
    try {
        //Extract the User's password from the request body
        const {email, password} =req.body
        if(email == undefined || password == undefined){
            return res.status(400).json({
                message: "please enter email and password"
            });
        };
        // check for the user and throw errorr if not found
        const user = await userModel.findOne({email: email.toLowerCase()})
        if(user == null){
            return res.status(404).json({
                message: "User not found"
            });
        }
        // check the password if it is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(isPasswordCorrect === false){
            return res.status(400).json({
                message: "Invalid Password"
            });
        }
        // Generate a token for the user
        const token = await jwt.sign({userId: user._id, isAdmin: user.isAdmin, isSuperAdmin:user.isSuperAdmin}, 
            process.env.SECRET, {expiresIn: '1d'});
        //password destructuring
        const {password: hashedPassword, ...data} = user._doc
        // send a success response
        res.status(200).json({
            message: "Login successful",
            data,
            token
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
};

exports.getAll = async(req,res)=>{
    try {
        const users = await userModel.find();
        res.status(200).json({
            message: "All user's in the database",
            data: users
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
};

exports.makeAdmin = async (req, res)=>{
    try {
        const {id} = req.params;
        // Find the user and confirm if the user exists
        const user = await userModel.findById(id);
        if(user == null){
            return res.status(404).json({
                message: "User not found"
            })
        };
        if(user.isAdmin == true){
            return res.status(400).json({
                message: "User is already an Admin"
            })
        };

        user.isAdmin = true

        await user.save();
        // Send a success response
        res.status(200).json({
            message: `User: ${user.fullName} is now an Admin`
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}