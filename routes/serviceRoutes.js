const express = require('express');
const router = express.Router();

const Service = require('../models/service');

//get all services

router.get('/',async(req,res)=>{
    try{
        const services = await Service.find();
        res.json(services);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

//post a service

router.post('/',async(req,res)=>{
    try{
        const{
            serviceName,
            description,
            price,
            duration,
            serviceCenterId,
            status
        }=req.body;

        const newService =new Service({
            serviceName,
            description,
            price,
            duration,
            serviceCenterId,
            status
        })

        const savedService = await newService.save();
        res.status(201).json(savedService)

    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

//put a service

router.put('/:id',async(req,res)=>{
    try{
        const updateService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
             {
                returnDocument: 'after',
                runValidators: true
            }
        )
        res.json(updateService);
        
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

// delete a service

router.delete('/:id',async(req,res)=>{
    try{
        const deleteService = await Service.findByIdAndUpdate(
            req.params.id
        )
        res.json({
            message:'service deleted successfully'

    });
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
})

module.exports = router;