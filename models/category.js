const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    rooms:[{type: mongoose.SchemaTypes.ObjectId, ref:'Rooms'},   
    ],
    amenities: {type:[String],
     
    },
    createdBy:{
        adminId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
         },
         adminName: {
            type: String
        }
    }
}, {timestapms: true});

const categoryModel = mongoose.model('Categories', categorySchema);

module.exports = categoryModel;