const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
          required: true
    },

    vehicleId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Vehicle', 
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
                
                date: { 
                    type: Date,
                     required: true
                     },
                     
                     timeSlot: {
                         type: String,
                          required: true
                         },

                           price: {
                             type: Number,
                              required: true 
                            },

                            status: { 
                                type: String, 
                                enum: [ 'Pending', 'Confirmed', 'Vehicle Received', 'Service In Progress', 'Completed', 'Cancelled', 'Rejected' ], 
                                default: 'Pending'
                             }


            
})

module.exports = mongoose.model('Booking',bookingSchema);