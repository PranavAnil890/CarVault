const mongoose = require('mongoose');

const reviewSchema  = new mongoose.Schema({

    userId:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'user',
         required: true
    },

    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking',
        required:true

    },

    serviceCenterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'serviceCenter',
        required:true
    },

    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'service',
        required:true
    },

    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },

    comment:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Review', reviewSchema);