const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
});

const Campground = mongoose.model("Campground", campSchema);

module.exports = Campground;
