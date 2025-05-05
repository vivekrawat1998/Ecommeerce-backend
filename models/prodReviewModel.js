const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    productId: {
        type:String,
        required: true
    },
    customerName: {
        type:String,
        required: true
    },
    customerId: {
        type:String,
        required: true
    },
    review: {
        type:String,
        required: true
    },
    customerRating:{
        type:Number,
        required: true,
        default: 1
    },
    dateCreated: {
        type:Date,
        default: Date.now
    },
}, {timestamps: true});

reviewSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
 
reviewSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Review',reviewSchema);