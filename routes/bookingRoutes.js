const express = require('express');
const router = express.Router();

const Booking = require('../models/booking');
const ServiceHistory = require('../models/serviceHistory');

// get all booking

router.get('/',async(req,res)=>{
    try{
        const bookings = await Booking.find()
        .populate('userId', 'name email')
            .populate('vehicleId', 'brand model registrationNumber')
            .populate('serviceId', 'serviceName price');
        res.json(bookings);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

// post all booking

router.post('/',async(req,res)=>{
    try{

        const{
            userId,
            vehicleId,
            serviceId,
            serviceCenterId,
            date,
            timeSlotId,
            time
            
        }=req.body

        const newBooking = new Booking({
            userId,
            vehicleId,
            serviceId,
            serviceCenterId,
            date,
            timeSlotId,
            time
            
        });

        const savedBooking = await newBooking.save()
        res.status(201).json(savedBooking)
    } catch (error) {

        console.log("BOOKING ERROR:", error.message);

        res.status(400).json({
            message: error.message
        });
    }
});

//put all booking

router.put('/:id', async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id)
            .populate('serviceId', 'price');

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        const oldStatus = booking.status;

        booking.status = req.body.status;

        await booking.save();


        // Create service history when completed

        if (
            booking.status === 'Completed' &&
            oldStatus !== 'Completed'
        ) {

            await ServiceHistory.create({

                userId: booking.userId,
                vehicleId: booking.vehicleId,
                bookingId: booking._id,
                serviceId: booking.serviceId._id,
                serviceCenterId: booking.serviceCenterId,
                serviceDate: booking.date,
                price: booking.serviceId.price

            });

        }

        res.json(booking);

    } catch (error) {

        console.log(error);

        res.status(400).json({
            message: error.message
        });

    }

});

//delete  the booking

router.delete('/:id',async(req,res)=>{
    try{
        const deleteBooking = await Booking.findByIdAndDelete(
            req.params.id
        );
        if(!deleteBooking){
           return res.status(404).json({
                message:'Booking not found'
            });
        }
        res.json({
            message:'booking deleted successfully'
        });

    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

module.exports = router;