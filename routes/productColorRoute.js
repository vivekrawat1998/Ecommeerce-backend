const express = require('express');
const productColorModel = require('../models/productColorModel');
const router = express.Router();


router.get('/', async(req,res) => {
    try{
        const productColorList = await productColorModel.find();
        if(!productColorList){
            res.status(500).json({success: false})
        }
        return res.status(200).json(productColorList);
    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get('/:id', async (req, res) => {
    try {
        const item = await productColorModel.findById(req.params.id);
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
        let productColor = new productColorModel({
            color: req.body.color
        });

        if(!productColor){
            res.status(500).json({
                error: err,
                success: false
            })
        }
        productColor = await productColor.save();
        return res.status(200).json(productColor);
    } catch (error) {
        res.status(500).json({success: false})
    }
})

router.delete('/:id',async (req,res)=>{
    try {
        const deletedItem = await productColorModel.findByIdAndDelete(req.params.id);
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
        const item = await productColorModel.findByIdAndUpdate( res.params.id, { color: req.body.color}, {new: true} )
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