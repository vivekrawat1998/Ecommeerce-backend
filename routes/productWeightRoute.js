const express = require('express');
const productWeightModel = require('../models/productWeightModel');

const router = express.Router();


router.get('/', async(req,res) => {
    try{
        const productWeightList = await productWeightModel.find();
        if(!productWeightList){
            res.status(500).json({success: false})
        }
        return res.status(200).json(productWeightList);
    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get('/:id', async (req, res) => {
    try {
        const item = await productWeightModel.findById(req.params.id);
        if (!item) {
        return res.status(404).json({ success: false, message: "item Not Found" });
        }

    return res.status(200).json(item);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
});



router.post('/create', async (req,res) => {
    try {
        let productWeight = new productWeightModel({
            productWeight: req.body.productWeight
        });

        if(!productWeight){
            res.status(500).json({
                error: err,
                success: false
            })
        }
        productWeight = await productWeight.save();
        return res.status(200).json(productWeight);
    } catch (error) {
        res.status(500).json({success: false})
    }
})

router.delete('/:id',async (req,res)=>{
    try {
        const deletedItem = await productWeightModel.findByIdAndDelete(req.params.id);
        if(!deletedItem){
            res.status(400).json({
                message: 'Item not found',
                success: false
            })
        }
        res.status(200).json({
            success: true,
            message: 'Item deleted',
        })
    } catch (error) {
        res.status(500).json({success: false})
        
    }
});


router.put('/:id', async(req,res)=>{
    try {
        const item = await productWeightModel.findByIdAndUpdate( res.params.id, { productWeight: req.body.productWeight}, {new: true} )
      if (!item){
        return res.status(500).json({
            message: 'item connot be updated',
            success: false
        })
      }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({success: false})

    }
});

module.exports = router