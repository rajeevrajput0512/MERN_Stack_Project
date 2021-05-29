const mongoose = require("mongoose");
const Review = require("./Review");

const campSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Campground = mongoose.model("Campground", campSchema);

module.exports = Campground;
