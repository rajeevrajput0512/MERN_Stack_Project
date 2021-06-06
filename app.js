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
const Camper = require("./routes/Camps");
const Reviewers = require("./routes/Routers");
const Session = require("express-session");
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

app.use(
  Session({
    secret: "Nottoreviel123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use("/campgrounds", Camper);
app.use("/campgrounds/:id/reviews/", Reviewers);
app.get(
  "/",
  catchAsync(async (req, res, next) => {
    const data = await Campground.find({});
    res.render("campgrounds/home", { data });
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
