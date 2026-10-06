const express = require('express');
const router = express.Router();

const ServiceCenter = require('../models/serviceCenter');


// Get all service centers

router.get('/', async (req, res) => {

    try {

        const serviceCenters = await ServiceCenter.find();

        res.json(serviceCenters);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// Create service center profile

router.post('/', async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            rating,
            userId
        } = req.body;


        const newServiceCenter = new ServiceCenter({

            name,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            rating,
            userId

        });


        const savedServiceCenter = await newServiceCenter.save();

        res.status(201).json(savedServiceCenter);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// Update service center

router.put('/:id', async (req, res) => {

    try {

        const updateServiceCenter =
            await ServiceCenter.findByIdAndUpdate(
                req.params.id,

                {
                    ...req.body,
                    profileUpdatedAt: new Date()
                },
                {
                    returnDocument: 'after',
                    runValidators: true
                }
            );


        if (!updateServiceCenter) {

            return res.status(404).json({
                message: 'Service center not found'
            });

        }


        res.json(updateServiceCenter);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// Delete service center

router.delete('/:id', async (req, res) => {

    try {

        const deleteServiceCenter =
            await ServiceCenter.findByIdAndDelete(
                req.params.id
            );


        if (!deleteServiceCenter) {

            return res.status(404).json({
                message: 'Service center not found'
            });

        }


        res.json({
            message: 'Service center deleted successfully'
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


module.exports = router;