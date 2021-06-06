const Express = require("express");
const Routes = Express.Router();
const catchAsync = require("../utils/catchAsync");
const customError = require("../utils/customError");
const Review = require("../Schema/review");
const Campground = require("../Schema/campground");
const { Camopschema, reviewSchema } = require("../Schema/Joicamp");

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

Routes.get(
  "/",
  catchAsync(async (req, res, next) => {
    const data = await Campground.find({});
    res.render("campgrounds/home", { data });
  })
);

Routes.get(
  "/new",
  catchAsync(async (req, res) => {
    res.render("campgrounds/formtoadd");
  })
);

Routes.post(
  "/",
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

Routes.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

Routes.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = await Campground.findById(id);
    res.render("campgrounds/update", { data });
  })
);

Routes.put(
  "/:id",
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
Routes.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await Campground.findById(id).populate("reviews");
    // console.log(data);
    res.render("campgrounds/details", { data });
  })
);

module.exports = Routes;
