const mongoose = require('mongoose');

const productColorSchema = mongoose.Schema({
   color:{
        type:String,
        default:null
    },
}, { timestamps: true });

productColorSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
 
productColorSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('productColor',productColorSchema);
