const roomModel = require("../models/room");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const categoryModel = require("../models/category");

exports.createRoom = async (req, res) => {
    try {

        //Get the category Id from the params
        const { id: categoryId } = req.params;
        //Extract the required fields from the request body
        const { roomName, price, description, roomNumber } = req.body;


        const categoryExists = await categoryModel.findById(categoryId);
        if (categoryExists == null) {
            return res.status(404).json({
                message: "Category not found"
            })
        }
        //Get the files into a variable
        const file = req.files;

        //Declare an empty array to help hold the result
        const imageArray = [];

        //Handle the image uploading to cloudinary one after the other
        for (const image of file) {
            const result = await cloudinary.uploader.upload(image.path);

            //Delete the image from  the local storage
            fs.unlinkSync(image.path);

            //Create an object to hold the image properties
            const imageProperties = {
                imageUrl: result.secure_url,
                imageId: result.public_id
            }

            //Push the result into the initial empty array
            imageArray.push(imageProperties);
        }
        //Create an instance of the document
        const room = new roomModel({
            category: id,
            roomName,
            roomNumber,
            price,
            description,
            images: imageArray
        });

        //Add the new room to the category
        categoryExists.rooms.push(room._id);

        //Save the changes to the database
        await room.save();
        //Send a response to the user
        res.status(200).json({
            message: "Room created successfully",
            data: room
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};


exports.deleteRoomImage = async (req, res) => {
    try {
        // Extract room ID and image ID from request parameters
        const { roomId, imageId } = req.params;

        // Find the room by ID
        const room = await roomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Find the image in the images array
        const imageIndex = room.images.findIndex(img => img.imageId === imageId);
        if (imageIndex === -1) {
            return res.status(404).json({ message: "Image not found in room" });
        }

        // Get the image object
        const image = room.images[imageIndex];

        // Remove the image from Cloudinary
        await cloudinary.uploader.destroy(image.imageId);

        // Remove the image from the room's images array
        room.images.splice(imageIndex, 1);

        // Save the updated room document
        await room.save();

        res.status(200).json({
            message: "Image deleted successfully",
            data: room
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


exports.updateRoomImage = async (req, res) => {
    try {
        const { roomId, imageId } = req.params;
        const file = req.file; // Assuming you're using multer for file uploads

        if (!file) return res.status(400).json({ message: "No image uploaded" });

        // Find the room
        const room = await roomModel.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });

        // Find the image in the array
        const imageIndex = room.images.findIndex(img => img.imageId === imageId);
        if (imageIndex === -1) return res.status(404).json({ message: "Image not found in room" });

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path);
        // Delete from local storage
        fs.unlinkSync(file.path); 
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(imageId);

        // Update image in the array
        room.images[imageIndex] = {
            imageUrl: result.secure_url,
            imageId: result.public_id
        };

        // Save the updated room document
        await room.save();

        res.status(200).json({ message: "Image updated successfully", data: room });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
