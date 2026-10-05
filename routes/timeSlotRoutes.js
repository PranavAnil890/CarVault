const express = require('express')
const router = express.Router();
const timeSlot = require('../models/timeSlot') 

//get all timeslot

router.get('/',async(req,res) =>{

    try{
        const timeSlotes = await timeSlot.find()
    res.json(timeSlotes);
    }catch(error){
        res.status(500).json({
            message:error.message
        });

    }
    
});

// post all timeSlot

router.post('/',async(req,res)=>{
    try{
        const{
            serviceCenterId,
            date,
            time,
            isBooked

        }=req.body;

        const newTimeSlot = new timeSlot({
            serviceCenterId,
            date,
            time,
            isBooked

        });

        const savedTimeSlot = await newTimeSlot.save();
        res.status(201).json(savedTimeSlot);

    }catch(error){
         res.status(400).json({
             message:error.message
         });
           
    }
});

// put a timeSlot

router.put('/:id',async(req,res)=>{
    try{
        const updatedTimeSlot = await timeSlot.findByIdAndUpdate(
             req.params.id,
                req.body,
                {
                      returnDocument: 'after',
                    runValidators: true
                }
        );

        if(!updatedTimeSlot){
            res.status(404).json({
                message: 'time slot not found'
            });
        }
        res.json(updatedTimeSlot);
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

//Delete a time slot

router.delete('/:id',async(req,res)=>{
    try{
        const deletedTimeSlot = await timeSlot.findByIdAndDelete(
            req.params.id,

        );
        if(!deletedTimeSlot){
            res.status(404).json({
                message: 'time slot not found'
            });
        }

        res.json({
            message: 'Time slot deleted successfully'
        });
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

module.exports = router;