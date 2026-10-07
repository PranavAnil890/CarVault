const express = require('express');
const router = express.Router();

const Booking = require('../models/booking');
const ServiceHistory = require('../models/serviceHistory');
const User = require('../models/user');
const transporter = require('../config/email');

// GET all bookings
router.get('/', async (req, res) => {
    try {

        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('vehicleId', 'brand model registrationNumber')
            .populate('serviceId', 'serviceName price');

        res.json(bookings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// POST booking
router.post('/', async (req, res) => {

    try {

        const {
            userId,
            vehicleId,
            serviceId,
            serviceCenterId,
            date,
            timeSlotId,
            time
        } = req.body;

        const newBooking = new Booking({
            userId,
            vehicleId,
            serviceId,
            serviceCenterId,
            date,
            timeSlotId,
            time
        });

        const savedBooking = await newBooking.save();

        res.status(201).json(savedBooking);

    } catch (error) {

        console.log("BOOKING ERROR:", error.message);

        res.status(400).json({
            message: error.message
        });

    }
});


// PUT booking status
router.put('/:id', async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id)
            .populate('serviceId', 'serviceName price');

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        const oldStatus = booking.status;

        // Update status
        booking.status = req.body.status;

        await booking.save();

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

            const customer = await User.findById(
                booking.userId
            );


            // Send email
            if (customer) {

                try {

                    await transporter.sendMail({

                        from: process.env.EMAIL_USER,

                        to: customer.email,

                        subject: 'CarVault - Service Completed',

                        html: `
                            <h2>Service Completed</h2>

                            <p>Hello ${customer.name},</p>

                            <p>
                                Your car service has been completed successfully.
                            </p>

                            <p>
                                <strong>Service:</strong>
                                ${booking.serviceId.serviceName}
                            </p>

                            <p>
                                <strong>Amount:</strong>
                                ₹${booking.serviceId.price}
                            </p>

                            <p>
                                Thank you for using CarVault.
                            </p>

                            <p>
                                Regards,<br>
                                CarVault Team
                            </p>
                        `
                    });

                    console.log('Email sent successfully');

                } catch (emailError) {

                    console.log(
                        'Email sending failed:',
                        emailError.message
                    );

                }
            }
        }

        res.json(booking);

    } catch (error) {

        console.log("UPDATE BOOKING ERROR:", error.message);

        res.status(400).json({
            message: error.message
        });

    }
});


// DELETE booking
router.delete('/:id', async (req, res) => {

    try {

        const deleteBooking = await Booking.findByIdAndDelete(
            req.params.id
        );

        if (!deleteBooking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        res.json({
            message: 'Booking deleted successfully'
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


module.exports = router;