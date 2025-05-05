const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    slug: {
      type: String,
      unique: true, 
      required: true,
    },
    color: {
      type: String,
    },
    parentId: {
      type:String
    }
  },
  { timestamps: true }
);

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Category", categorySchema);
