const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },

    password:{
        type:String,
        required:true,
    },

    role:{

        type:String,
        enum:['customer','serviceCenter','admin'],
        default:'customer'
    },

    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    }

})

module.exports = mongoose.model('user',userSchema)
