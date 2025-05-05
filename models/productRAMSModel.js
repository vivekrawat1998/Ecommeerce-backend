const mongoose =  require('mongoose');

const productRamsSchema = mongoose.Schema({
    productRam:{
        type:String,
        default:null
    },
}, { timestamps: true });

productRamsSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
 
productRamsSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('productRams',productRamsSchema);
