const express = require('express');
const router = express.Router();

const ServiceCenter = require('../models/serviceCenter');
const bcrypt =require('bcryptjs');

//get all service centers

router.get('/',async(req,res)=>{
    try{
        const serviceCenters = await ServiceCenter.find();
        res.json(serviceCenters);

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

//post a service center

router.post('/',async(req,res)=>{
    try{
        const{
            name,
            email,
            password,
            phone,
            address,
            city,
            state,
            pincode,
            rating,
        }=req.body;

        const hashedPassword = await bcrypt.hash(
            password,10

        );

        const newServiceCenter  = new ServiceCenter({
            name,
            email,
            password:hashedPassword,
            phone,
            address,
            city,
            state,
            pincode,
            rating,

        });
        const savedServiceCenter = await newServiceCenter.save();
        res.status(201).json(savedServiceCenter);
        
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

//put a service center

router.put('/:id',async(req,res)=>{
    try{
        const updateServiceCenter = await ServiceCenter.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }

        );
        res.json(updateServiceCenter);
        
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

// delete  a service center

router.delete('/:id',async(req,res)=>{
    try{
        const deleteServiceCenter = await ServiceCenter.findByIdAndDelete(
            req.params.id
        );
        res.json(deleteServiceCenter);
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

module.exports = router;