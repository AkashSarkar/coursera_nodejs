var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

var indexRouter = require("./routes/index");

const dishRoutes = require("./routes/dishRouter");
const leaderRouters = require("./routes/leaderRouter");
const promoRoutes = require("./routes/promoRouter");
const userRoutes = require("./routes/userRouter");
const uploadRoutes = require("./routes/uploadRouter");

const config = require("./config");

const { hostname } = require("os");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const url = config.mongoUrl;

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

connect
  .then((db) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(passport.initialize());

app.all("*", (req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(
      307,
      "https://" + "localhost" + ":" + app.get("secPort") + req.url
    );
  }
});

app.use("/", indexRouter);
app.use("/users", userRoutes);
app.use("/dishes", dishRoutes);
app.use("/promotions", promoRoutes);
app.use("/leaders", leaderRouters);
app.use("/imageUpload", uploadRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
