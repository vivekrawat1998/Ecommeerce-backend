const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema(
  {
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

bannerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

bannerSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Banner", bannerSchema);
