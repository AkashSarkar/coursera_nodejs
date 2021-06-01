const express = require("express");
const mongoose = require("mongoose");
const { verifyUser, verifyAdmin } = require("../src/Authenticate");
const Favorites = require("../src/Models/Favorite");
const cors = require("./cors");
const favoriteRoutes = express.Router();

favoriteRoutes
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then((fav) => {
        if (fav) {
          return res.status(200).json(fav);
        } else {
          return res.status(404).json({ Message: "Favorites not found" });
        }
      })
      .catch((err) => next(err));
  })
  .post(verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then((resp) => {
        if (resp.length === 0) {
          Favorites.create({
            user: req.user._id,
            dishes: req.body,
          }).then((fav) => {
            return res
              .status(201)
              .json({ Message: "Favorites created", response: fav });
          });
        } else {
          for (let j = 0; j < req.body.length; j++) {
            const status = resp.dishes.some(
              (dish) => dish._id.toString() === req.body[j]._id.toString()
            );
            if (!status) {
              resp.dishes.push(req.body[j]._id);
              resp.save();
            }
          }
          return res.status(201).json({ Message: "Favorites created" });
        }
      })
      .catch((err) => next(err));
  })
  .put(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /favorites");
  })
  .delete(verifyUser, (req, res, next) => {
    Favorites.findByIdAndDelete({ user: req.user._id }).then(() => {
      return res.status(200).json({
        status: "all deleted",
      });
    });
  });

favoriteRoutes
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then((fav) => {
        if (fav) {
          const dish = fav.dishes.filter(
            (d) => d._id.toString() === req.params.dishId.toString()
          );
          return res.status(200).json(dish[0]);
        } else {
          return res.status(404).json({ Message: "Favorites not found" });
        }
      })
      .catch((err) => next(err));
  })
  .post(verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then((resp) => {
        if (resp.length !== 0) {
          const status = resp.dishes.some(
            (dish) => dish._id.toString() === req.params.dishId.toString()
          );
          if (!status) {
            resp.dishes.push(req.params.dishId);
            resp.save().then(() => {
              return res.status(201).json({ Message: "Favorites created" });
            });
          } else {
            return res.status(403).json({ Message: "Dish already exist" });
          }
        } else {
          return res.status(404).json({ Message: "Entry not found" });
        }
      })
      .catch((err) => next(err));
  })
  .put(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /favorites");
  })
  .delete(verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then((resp) => {
      if (resp) {
        for (let j = 0; j < resp.dishes.length; j++) {
          if (resp.dishes[j]._id.toString() === req.params.dishId.toString()) {
            resp.dishes.splice(j, 1);
            resp.save().then(() => {
              return res.status(200).json({
                status: "Dish deleted",
              });
            });
          }
        }
      } else {
        return res.status(404).json({ Message: "Entry not found" });
      }
    });
  });

module.exports = favoriteRoutes;
