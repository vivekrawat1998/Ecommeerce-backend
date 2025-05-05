const express = require('express');
const productSizeModel = require("../models/productSizeModel")

const router = express.Router();


router.get('/', async(req,res) => {
    try{
        const productSizeList = await productSizeModel.find();
        if(!productSizeList){
            res.status(500).json({success: false})
        }
        return res.status(200).json(productSizeList);
    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get('/:id', async (req, res) => {
    try {
        const item = await productSizeModel.findById(req.params.id);
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
        let productSize = new productSizeModel({
            size: req.body.size
        });

        if(!productSize){
            res.status(500).json({
                error: err,
                success: false
            })
        }
        productSize = await productSize.save();
        return res.status(200).json(productSize);
    } catch (error) {
        res.status(500).json({success: false})
    }
})

router.delete('/:id',async (req,res)=>{
    try {
        const deletedItem = await productSizeModel.findByIdAndDelete(req.params.id);
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
        const item = await productSizeModel.findByIdAndUpdate( res.params.id, { size: req.body.size}, {new: true} )
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