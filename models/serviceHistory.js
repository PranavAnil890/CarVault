const mongoose = require('mongoose');

const serviceHistorySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },

    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },

    serviceCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCenter',
        required: true
    },

    serviceDate: {
        type: Date,
        required: true
    },

    price: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('ServiceHistory',serviceHistorySchema);