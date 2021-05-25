const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
});

const Campground = mongoose.model("Campground", campSchema);

module.exports = Campground;
