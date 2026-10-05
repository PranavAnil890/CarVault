const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user',
          required: true
    },

    vehicleId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'vehicle', 
         required: true 
        },

        serviceId: {
             type: mongoose.Schema.Types.ObjectId,
              ref: 'service',
               required: true 
            },
            serviceCenterId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'serviceCenter',
                 required: true 
                }, 
                
                date: { 
                    type: Date,
                     required: true
                     },
                     
                     timeSlotId: {
                         type: mongoose.Schema.Types.ObjectId,
                          ref: 'TimeSlot',
                           required: true
                         },

                         time:{
                            type:String,
                            required:true
                         },

                          
                            status: { 
                                type: String, 
                                enum: [ 'Pending', 'Confirmed', 'Vehicle Received', 'Service In Progress', 'Completed', 'Cancelled', 'Rejected' ], 
                                default: 'Pending'
                             }


            
})

module.exports = mongoose.model('Booking',bookingSchema);