const express = require("express");
const app = express();
const path = require("path");
const ejsmate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOveride = require("method-override");
const Campground = require("./Schema/campground");
const catchAsync = require("./utils/catchAsync");
const customError = require("./utils/customError");
const Joi = require("joi");
const Review = require("./Schema/review");
const { Camopschema, reviewSchema } = require("./Schema/Joicamp");
const dbURL = mongoose
  .connect(
    "mongodb+srv://Admin-Rajeev:Test123@cluster0.nzb1d.mongodb.net/Yelpcamp",
    {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log(" I am connected to the data base");
  })
  .catch(() => {
    console.log(" i am having a Error Handling this case");
  });

//Middle Ware
app.engine("ejs", ejsmate);
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//SETUP EJS MATE

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

const ValidcampSchema = (req, res, next) => {
  const { error } = Camopschema.validate(req.body);
  if (error) {
    const CompleteMessage = error.details.map((el) => el.message).join(",");
    throw new customError(CompleteMessage, 404);
  } else {
    next();
  }
};

const ValidReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const CompleteMessage = error.details.map((el) => el.message).join(",");
    throw new customError(CompleteMessage, 404);
  } else {
    next();
  }
};

app.get(
  "/",
  catchAsync(async (req, res, next) => {
    const data = await Campground.find({});
    res.render("campgrounds/home", { data });
  })
);

app.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const data = await Campground.find({});
    res.render("campgrounds/home", { data });
  })
);

app.get(
  "/campgrounds/new",
  catchAsync(async (req, res) => {
    res.render("campgrounds/formtoadd");
  })
);

app.post(
  "/campgrounds",
  ValidcampSchema,
  catchAsync(async (req, res, next) => {
    const { title, price, description, location, image } = req.body;
    const nnn = new Campground({
      title: title,
      price: price,
      description: description,
      location: location,
      image: image,
    });
    await nnn.save();
    res.redirect(`/campgrounds/${nnn._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = await Campground.findById(id);
    res.render("campgrounds/update", { data });
  })
);

app.put(
  "/campgrounds/:id",
  ValidcampSchema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const nnn = await Campground.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect(`/campgrounds/${nnn._id}`);
  })
);
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await Campground.findById(id).populate("reviews");
    // console.log(data);
    res.render("campgrounds/details", { data });
  })
);

app.post(
  "/campgrounds/:id/reviews/",
  ValidReview,
  catchAsync(async (req, res) => {
    const target = await Campground.findById(req.params.id);
    const rev = new Review(req.body.review);
    target.reviews.unshift(rev);
    await rev.save();
    await target.save();
    res.redirect(`/campgrounds/${target._id}`);
  })
);

app.delete(
  "/campgrounds/:id/reviews/:reviewID",
  catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new customError("Page Cannot be found", 404));
});
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = " Something is wrong  I cant find out";
  }
  res.status(status).render("error", { err });
});

// Listener
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(" hey yes buddy ");
});
