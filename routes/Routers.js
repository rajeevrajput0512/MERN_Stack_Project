const Express = require("express");
const Routes = Express.Router({ mergeParams: true });
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

Routes.post(
  "/",
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

Routes.delete(
  "/:reviewID",
  catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = Routes;
