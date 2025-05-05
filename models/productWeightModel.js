const mongoose = require('mongoose');

const productWeightSchema = mongoose.Schema({
    productWeight:{
        type:String,
        default:null
    },
}, { timestamps: true });

productWeightSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
 
productWeightSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('productWeight',productWeightSchema);
