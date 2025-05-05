const mongoose = require('mongoose');

const recentlyProductSchema = mongoose.Schema({
    prodId: {
        type:String,
        default: ''
    },
    name: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    images: [
        {
          public_id: String,
          url: String,
        },
    ],
    brand: {
        type:String,
        default: ''
    },
    price: {
        type:Number,
        default: 0
    },
    oldPrice: {
        type:Number,
        default: 0
    },
    catName:{
        type:String,
        default:''
    },
    subCatId : {
        type:String,
        default:''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCat: {
        type: String,
        default:''
    },
    countInStock: {
        type:Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type:Boolean,
        default: false,
    },
    discount:{
        type:Number,
        required: true,
    },
    productRam: [
        {
        type:String,
        default: null,  
        },
    ],
    productSize: [
        {
        type:String,
        default: null,   
    },  
  ],
    productWeight:[ 
     {
        type:String,
        default: null,    
    },
],
    dateCreated: {
        type:Date,
        default: Date.now
    },
},
 {
    timestamps: true
});

recentlyProductSchema.virtual('id').get(function () { 
    return this._id.toHexString();
}); 

recentlyProductSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('RecentlyProduct', recentlyProductSchema)