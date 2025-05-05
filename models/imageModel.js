const mongoose = require('mongoose');

const imageUploadSchema = mongoose.Schema({
    images: [
        {
            type:String,
            required:true
        }
    ]
}, {timestamps: true});

imageUploadSchema.virtual('id').get(function () { 
    return this._id.toHexString();
});

imageUploadSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("ImageUpload", imageUploadSchema);