const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const Users = require("../Models/Users");
const Authenticate = require("../Authenticate");

const userRoutes = express.Router();

userRoutes.get("/", (req, res, next) => {
  res.send("hello");
});

userRoutes.post("/signup", (req, res, next) => {
  Users.register(
    new Users({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.json({
            status: "Registration success",
            success: true,
          });
        });
      }
    }
  );
});

userRoutes.post("/login", passport.authenticate("local"), (req, res, next) => {
  const token = Authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.json({
    status: "Login success",
    success: true,
    token: token,
  });
});

userRoutes.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
  } else {
    let err = new Error("You are not logged in");
    err.status = 403;
    next(err);
  }
});

module.exports = userRoutes;
