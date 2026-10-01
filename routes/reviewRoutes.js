const express = require('express');
const router = express.Router();
const review = require('../models/review');

// get the review

router.get('/',async(req,res)=>{
    try{
        const reviews = await review.find();
        res.json(reviews)
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

//post the review

router.post('/',async(req,res)=>{
    try{
        const{
            userId,
            bookingId,
            serviceCenterId,
            serviceId,
            rating,
            comment,
        }=req.body

        const newReview = new review({
           userId,
            bookingId,
            serviceCenterId,
            serviceId,
            rating,
            comment 
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview)
    }catch(error){
        res.status(400).json({
            message:error.message
        });

    }
});

// put the review

router.put('/:id',async(req,res)=>{
    try{
        const updateReview = await review.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );
        if(!updateReview){
            res.status(404).json({
                message:'review not found'
            })

        }
        res.json(updateReview)
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
});

// delete the review

router.delete('/:id',async(req,res)=>{
    try{
        const deleteReview = await review.findByIdAndDelete(
            req.params.id 
        );
        if(!deleteReview){
            res.status(404).json({
                message:'review not found'
            })
        }
        res.json({
            message:'review deleted successfully'
        });

    }catch(error){
        res.status(400).json({
            messgae:error.message
        });
    }
});

module.exports = router;