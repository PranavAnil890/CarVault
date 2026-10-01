const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({

    registrationNumber: {
        type:String,
        required:true,
        unique:true
    },
    brand: {
        type:String,
        required:true

    },
    model: {
        type:String,
        required:true
    },

    year: {
        type:Number,
        required:true
    },
    fuelType: {
        type:String,
        required:true,
        enum:['petrol','diesel','electric','hybrid','cng'],
        
    },
    mileage: {
        type:Number,
        required:true
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    }
    
    
})
module.exports = mongoose.model('vehicle',vehicleSchema);

