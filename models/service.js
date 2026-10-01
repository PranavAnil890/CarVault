const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({

    serviceName:{
        type:String,
        required:true,

    },

    description:{
        type:String,
        required:true,

    },
    price:{
        type:Number,
        required:true,
    },

    duration:{
        type:String,
        required:true,
        enum:['1 hour','2 hour','3 hour','4 hour','5 hour','6 hour', '7 hour', '8 hour'],
    },

    serviceCenterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'serviceCenter',
        required:true,
    },

    status:{
        type:String,
        required:true,
        enum:['active','inactive'],
    }


})
module.exports = mongoose.model('service',serviceSchema);