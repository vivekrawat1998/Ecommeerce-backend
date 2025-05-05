const express = require('express');
const productRAMSModel = require("../models/productRAMSModel");

const router = express.Router();

router.get('/', async(req,res) => {
    try{
        const productRamList = await productRAMSModel.find();
        if(!productRamList){
            res.status(404).json({success: false, message: "Product Ram Not Found" })
        }
        return res.status(200).json({productRamList: productRamList, success: true, message:"Products Rams get successfully"});
    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get('/:id', async (req, res) => {
     try {
         const item = await productRAMSModel.findById(req.params.id);
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
        let productRAMS = new productRAMSModel({
            productRam: req.body.productRam
        });

        if(!productRAMS){
            res.status(404).json({
                error: err,
                success: false
            })
        }
        productRAMS = await productRAMS.save();
        return res.status(201).json(productRAMS);
    } catch (error) {
        res.status(500).json({success: false})
    }
})

router.delete('/:id',async (req,res)=>{
    try {
        const deletedItem = await productRAMSModel.findByIdAndDelete(req.params.id);
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
        const item = await productRAMSModel.findByIdAndUpdate(
            res.params.id,
            {           
              productRam: req.body.productRam
            },
            {new: true}
    )
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

module.exports = router;