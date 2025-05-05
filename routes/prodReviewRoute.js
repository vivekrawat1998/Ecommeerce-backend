const express = require('express');
const prodReviewModel = require('../models/prodReviewModel')

const router = express.Router();

router.get('/', async(req, res) => {
    let reviews = [];

    try {
        if(req.query.productId!==undefined && req.query.productId!==null && req.query.productId!==""){
            reviews = await prodReviewModel.find({productId: req.query.productId});
        }else{
            reviews = await prodReviewModel.find();
        }

        if(!reviews){
            res.status(500).json({success: false});
        }

        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error"});
    }
})

router.get('/:id', async(req, res) => {
    try {
        const review = await prodReviewModel.findById(req.params.id);
        if(!review){
            return res.status(500).json({message: "Review Get By Given Id"})
        }

        return res.status(200).json(review)
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error"});
    }
});

router.post('/add', async(req, res) => {
    try {
        let review = new prodReviewModel({
            customerName: req.body.customerName,
            productId: req.body.productId,
            review: req.body.review,
            customerId: req.body.customerId,
            customerRating: req.body.customerRating,
        });

        if(!review){
            res.status(500).json({
                error: err,
                message: "Error while create review"
            })
        }

        review = await review.save();

        res.status(201).json(review);
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error"});
    }
})

router.get('/get/count', async(req, res) => {
    try {
        const reviewCount = await prodReviewModel.countDocuments({parentId:undefined});
        if(!reviewCount){
            res.status(500).json({success: false});
        }else{
            res.send({
                reviewCount: reviewCount
            })
        }
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error"});
    }
  })
  

module.exports = router;