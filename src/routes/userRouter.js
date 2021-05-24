const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const Users = require("../Models/Users");
const { verifyAdmin, verifyUser, getToken } = require("../Authenticate");

const userRoutes = express.Router();

userRoutes.get("/", [verifyUser, verifyAdmin], async (req, res, next) => {
  const users = await Users.find({});
  return res.status(200).json(users);
});

userRoutes.post("/signup", (req, res, next) => {
  Users.register(
    new Users({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (req.body.firstName) user.firstName = req.body.firstName;
      if (req.body.lastName) user.lastName = req.body.lastName;
      if (req.body.admin) user.admin = req.body.admin;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
          return;
        }
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      });
    }
  );
});

userRoutes.post("/login", passport.authenticate("local"), (req, res, next) => {
  const token = getToken({ _id: req.user._id });
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
