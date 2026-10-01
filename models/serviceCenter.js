const mongoose = require('mongoose');
const serviceCenterSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },

     password: {
        type: String,
        required: true,
    },

    phone:{
        type:String,
        required:true,
    },

    address:{
        type:String,
        required:true,
    },

    city:{
        type:String,
        required:true,
    },

    state:{
        type:String,
        required:true,
    },

    pincode:{
        type:String,
        required:true,
    },

    rating:{
        type:Number,
         default: 0
    },


})

module.exports = mongoose.model('serviceCenter',serviceCenterSchema);