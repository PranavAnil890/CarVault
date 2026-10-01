const mongoose = require('mongoose')

const timeSlotSchema = new mongoose.Schema({

    serviceCenterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ServiceCenter',
        required:true,
    },

    date:{
        type:Date,
        required:true
    },

    time:{
        type:String,
        required:true
    },

    isBooked:{
        type:Boolean,
        default:false
    }


})

module.exports = mongoose.model('TimeSlot',timeSlotSchema);