const express = require("express");
const mongoose = require("mongoose");

const Dishes = require("../Models/Dishes");

const dishRoutes = express.Router();

dishRoutes
  .route("/")
  .get((req, res, next) => {
    Dishes.find({})
      .then((dishes) => {
        return res.status(200).json(dishes);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        return res.status(201).json({
          status: "success",
          dish: dish,
        });
      })
      .catch((err) => console.log(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /dishes");
  })
  .delete((req, res, next) => {
    Dishes.deleteMany({})
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => next(err));
  });

dishRoutes
  .route("/:dishId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        return res.status(200).json(dish);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((dish) => {
        return res.status(201).json(dish);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => next(err));
  });

dishRoutes
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish) {
          return res.status(200).json(dish.comments);
        } else {
          err = new Error("Dish not found");
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish) {
          dish.comments.push(req.body);
          dish.save().then((resp) => {
            return res.status(201).json(resp);
          });
        } else {
          err = new Error("Dish not found");
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => console.log(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /dishes");
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish) {
          for (var i = dish.comments.length - 1; i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
          }
          dish.save().then((resp) => {
            return res.status(201).json(resp);
          });
        } else {
          err = new Error("Dish not found");
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => next(err));
  });

dishRoutes
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        return res.status(200).json(dish);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((dish) => {
        return res.status(201).json(dish);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => next(err));
  });

module.exports = dishRoutes;
