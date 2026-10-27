require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const AppError = require("./Crookie/Error");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieparser = require("cookie-parser");

// ROUTES
const router = express.Router();

//supoort pug internally in express
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Send all static Files via one method
// app.use(express.static("Crookie"));
// app.use(express.static(path.join(__dirname, "Crookie")));
app.use(express.static(path.join(__dirname, "test")));

app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
);

//import from beefRouter.js
const beefRouter = require("./routes/foodRouter");

const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const crookieRouter = require("./routes/crookieRoute");

app.use(morgan("dev"));

// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "/Crookie/index.html"));
// });

//global middlewares
const limiter = rateLimit({
  max: 100,
  windowMs: 3600000, // allow 100 requesst from the same IP address in one hour
  message: "Too many requests, please try again later",
});
app.use("/api", limiter);

//cookie parser
app.use(cookieparser());

//data sanitization against NoSQL attack  --------aka login wo email, only knowing password
app.use(mongoSanitize());

//against xss attack
app.use(xss());

//start mongoose server
mongoose
  .connect(
    "mongodb+srv://crookie:<password>@cluster0.u2w5zqi.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connection successful");
  });

app.listen(3000, function () {
  console.log("Web is  running on 3000");
});

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

// ROUTES
app.use("/", crookieRouter);
//Get all data from database
app.use("/api/beef", beefRouter);
//Get all user data from database
app.use("/api/user", userRouter);

//unknown Routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

//globlal error
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
