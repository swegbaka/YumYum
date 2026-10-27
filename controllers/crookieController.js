const Food = require("../models/foodModel");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const url = Food.find({}).select("Link -_id");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

// url.exec(function (err, foundurl) {
//   if (err) return next(err);
// });

exports.getbase = catchAsync(async (req, res, next) => {
  res.status(200).render("base");
});

exports.getcook = catchAsync(async (req, res, next) => {
  Food.find({}, function (err, foundItems) {
    res.status(200).render("icook", {
      foodName: foundItems,
    });
  });
});

exports.getabout = catchAsync(async (req, res, next) => {
  res.status(200).render("about");
});

exports.gethelp = catchAsync(async (req, res, next) => {
  res.status(200).render("help");
});

// exports.getdata = catchAsync(async (req, res, next) => {
//   const queryObj = { ...req.query };
//   const beef = await Beef.find(queryObj);
//   res.status(200).render("icook", {
//     foodName: foundItems,
//   });
// });

exports.getlogin = (req, res) => {
  res
    .status(200)
    // .set("Content-Security-Policy", "connect-src 'self' http://127.0.0.1:3000/")
    .render("login", {
      title: "Log into your account",
    });
};
