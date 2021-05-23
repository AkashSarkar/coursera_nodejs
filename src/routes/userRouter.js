const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const Users = require("../Models/Users");

const userRoutes = express.Router();

userRoutes.get("/", (req, res, next) => {
  res.send("hello");
});
userRoutes.post("/signup", (req, res, next) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        let err = new Error("User already exist");
        err.status = 403;
        next(err);
      } else {
        return Users.create({
          username: req.body.username,
          password: req.body.password,
        });
      }
    })
    .then((user) => {
      res.statusCode = 200;
      res.json({
        status: "Registration success",
        user: user,
      });
    });
});

userRoutes.post("/login", (req, res, next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");

    var username = auth[0];
    var password = auth[1];

    User.findOne({ username: username })
      .then((user) => {
        if (user === null) {
          var err = new Error("User " + username + " does not exist!");
          err.status = 403;
          return next(err);
        } else if (user.password !== password) {
          var err = new Error("Your password is incorrect!");
          err.status = 403;
          return next(err);
        } else if (user.username === username && user.password === password) {
          req.session.user = "authenticated";
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You are authenticated!");
        }
      })
      .catch((err) => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are already authenticated!");
  }
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
