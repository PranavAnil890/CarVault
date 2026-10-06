const express = require('express');
const router = express.Router();
const serviceHistory = require('../models/serviceHistory')

// get the servicehistory

router.get('/',async(req,res)=>{
    try{
        const serviceHistorys = await serviceHistory.find();
        res.json(serviceHistorys)
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

// post the serviceHistory

router.post('/',async(req,res)=>{
    try{
        const{
            userId,
            vehicleId,
            bookingId,
            serviceId,
            serviceCenterId,
            serviceDate,
            price
        }=req.body;

        const newServiceHistory = new serviceHistory({
            userId,
            vehicleId,
            bookingId,
            serviceId,
            serviceCenterId,
            serviceDate,
            price
        })

        const savedServiceHistory = await newServiceHistory.save();
         console.log("SAVED SERVICE HISTORY:", savedServiceHistory);

        res.status(201).json(savedServiceHistory)
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

// put the serviceHistory

router.put('/:id',async(req,res)=>{
    try{
        const updateServiceHistory = await serviceHistory.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );
        if(!updateServiceHistory){
            return res.status(404).json({
                message:'servicehistory not found'
            })
        }
        res.json(updateServiceHistory)
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

// delete the serviceHistory

router.delete('/:id',async(req,res)=>{
    try{
        const deleteServiceHistory = await serviceHistory.findByIdAndDelete(
             req.params.id
        )

        if(!deleteServiceHistory){
           return res.status(404).json({
                message:'servicehistory not found'
            });
        }
        res.json({
            message:'serviceHistory deleted successfully'
        });
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

module.exports = router;