const express = require("express");
const app = express();
const path = require("path");
const ejsmate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOveride = require("method-override");
const Campground = require("./Schema");
mongoose
  .connect("mongodb://localhost:27017/Yelpcamp", {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(" I am connected to the data base");
  })
  .catch(() => {
    console.log(" i am having a Error Handling this case");
  });

//Middle Ware
app.engine("ejs", ejsmate);
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname, "./pubic")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//SETUP EJS MATE

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

const port = process.env.PORT || 3000;

app.get("/campgrounds", async (req, res, next) => {
  const data = await Campground.find({});
  res.render("campgrounds/home", { data });
});

app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/formtoadd");
});

app.post("/campgrounds", async (req, res) => {
  const { title, description } = req.body;
  const nnn = new Campground({ title: title, description: description });
  await nnn.save();
  res.redirect(`/campgrounds/${nnn._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const data = await Campground.findById(id);
  res.render("campgrounds/update", { data });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const nnn = await Campground.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.redirect(`/campgrounds/${nnn._id}`);
});
app.get("/campgrounds/:id", async (req, res, next) => {
  const { id } = req.params;
  const data = await Campground.findById(id);
  res.render("campgrounds/details", { data });
});

app.listen(port, () => {
  console.log(" hey yes buddy ");
});
