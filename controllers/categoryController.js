const categoryModel = require('../models/category');
const userModel = require('../models/user')

exports.createCategory = async(req,res)=>{
    try {
        // Extract the user ID from the request User Object
        const {userId } = req.user;
        // Extract the required fields from the request
        const{name, amenities} = req.body
        // Find the user and check if it still exists
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        // Create a new Instance of the category
        const category = new categoryModel({
            name,
            amenities,
            createdBy:{
                adminId: userId,
                adminName: user.fullName
            }
        });
        // Save  the changes to the database
        await category.save()
        // Send a success message
        res.status(201).json({
            message: "Category Created",
            data: category
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Internal Server Erroor"
        })
    }
}


exports.getAll = async(req,res)=>{
    try {
        const cate = await categoryModel.find().populate('rooms',['roomName','price','description']);
     res.status(200).json({message:'All category in the database',
        data:cate
     })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Internal Server Erroor"
    })
}
}