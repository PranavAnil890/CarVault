const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');

//get all vechicle
router.get('/',async(req,res)=>{
    try{
        const vehicles=await Vehicle.find();
        res.json(vehicles);
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
});

//post a vehicle

router.post('/',async(req,res)=>{
    try{
        const{
            registrationNumber,
            brand,
            model,
            year,
            fuelType,
            mileage,
            userId
        } = req.body;

        const newVehicle = new Vehicle({
            registrationNumber,
            brand,
            model,
            year,
            fuelType,
            mileage,
            userId

        });
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    }catch(error){
        res.status(400).json({
            message: error.message
        });
    }
});

//put a vechicle

router.put('/:id',async(req,res)=>{
    try{
        const updateVehicle =await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }

        );
        if(!updateVehicle){
            return res.status(404).json({
                message: 'vehicle not found'
            })
        }
        res.json(updateVehicle);
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
});

//delete a vehicle

router.delete('/:id',async(req,res)=>{
    try{
        const deleteVehicle =await Vehicle.findByIdAndDelete(
            req.params.id
        )
        if(!deleteVehicle){
            return res.status(404).json({
                message: 'vehicle not found'
            })
        }
        res.json({
            message: 'vehicle deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }

});

module.exports =router;