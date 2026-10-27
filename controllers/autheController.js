const crypto = require("crypto");
const { promisify } = require("util");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../Crookie/Error");
const sendemail = require("./../Crookie/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //send jwt via cookie
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 86400000
    ),
    secure: true,
    http0nly: true,
  });
  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check email and password exist
  if (!email || !password) {
    return next(new AppError("Provide email and password", 400));
  }

  //check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or Password", 401));
  }

  //if all good, send token to client
  createSendToken(user, 200, res);
});

//P131
// exports.protect = catchAsync(async (req, res, nxt) => {
//   //getting token and check if is there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return nxt(new AppError("You are not logged in!", 401));
//   }

//   //validate token
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//   //check if user still exists
//   const freshUser = await User.findById(decoded.id);
//   if (!freshUser) {
//     return next(new AppError("The user no longer exist"), 401);
//   }
//   //check if user changed password after JWT was issued
//   nxt();
// });

exports.isLoggedin = catchAsync(async (req, res, nxt) => {
  if (req.cookie.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookie.jwt,
      process.env.JWT_SECRET
    );

    //check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next();
    }

    res.locals.user = freshUser;

    //if user are logged in
    return next();
  }
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on email
  const user = await User.findOne({ email: req.body.email });

  //if no user info found, throw err
  if (!user) {
    return next(new AppError("There is no such user info", 404));
  }

  //generate random reset token
  const resetToken = user.createPasswordReset();
  await user.save({ validateBeforeSave: false });

  //send user email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/user/resetPassword/${resetToken}`;

  const message = `Seems like  you forgot your password? Find it back in here: ${resetURL}`;

  try {
    await sendemail({
      email: user.email,
      subject: "Your password reset token is valid for 10 mins",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error,try again later "), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if only token not expired and user exist
  if (!user) {
    console.log(Date.now());
    return next(new AppError("Token is invalid or expired!", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //update
  createSendToken(user, 200, res);
});

//findOne not findByid
exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get user from collection
  const user = await User.findOne(req.params.id).select("+password");

  // check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 400));
  }
  //if it is, update
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
