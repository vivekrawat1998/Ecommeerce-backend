const mongoose = require('mongoose');

const myListSchema = new mongoose.Schema({
    productTitle: {
        type: String,
        required: true
    },
    image:  {
        type: String,
        required: true
    },
    // rating: {
    //     type: Number,
    //     required: true
    // },
    price: {
        type: Number,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
}, { timestamps: true });

myListSchema.virtual('id').get(function () { 
    return this._id.toHexString();
});

myListSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("MyList", myListSchema);
