const mongoose = require('mongoose');

const productSizeSchema = mongoose.Schema({
   size:{
        type:String,
        default:null
    },
}, { timestamps: true });

productSizeSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
 
productSizeSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('productSize',productSizeSchema);
