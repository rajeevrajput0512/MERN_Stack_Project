const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  value: Number,
  desc: String,
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
