const AppError = require("./../Crookie/Error");
const User = require("./../models/userModel");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //error if user POSTs password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("wrong route update", 400));
  }

  //filter only name and email
  const filter = filterObj(req.body, "name", "email");

  //update
  const updatedUser = await User.findOneAndUpdate(req.params.id, filter, {
    new: true,
    runValidator: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findOneAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllusers = catchAsync(async (req, res) => {
  const queryObj = { ...req.query };
  const user = await User.find(queryObj);

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: user.length,
    data: {
      user,
    },
  });
});

exports.getusers = catchAsync(async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
});

exports.createusers = catchAsync(async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
});
exports.updateUser = catchAsync(async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
});
exports.deleteusers = catchAsync(async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
});
