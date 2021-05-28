const express = require("express");
const mongoose = require("mongoose");
const { verifyUser, verifyAdmin } = require("../src/Authenticate");

const Dishes = require("../src/Models/Dishes");

const dishRoutes = express.Router();

dishRoutes
  .route("/")
  .get((req, res, next) => {
    Dishes.find({})
      .populate("comments.author")
      .then((dishes) => {
        return res.status(200).json(dishes);
      })
      .catch((err) => next(err));
  })
  .post([verifyUser, verifyAdmin], (req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        return res.status(201).json({
          status: "success",
          dish: dish,
        });
      })
      .catch((err) => console.log(err));
  })
  .put([verifyUser, verifyAdmin], (req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /dishes");
  })
  .delete([verifyUser, verifyAdmin], (req, res, next) => {
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
      .populate("comments.author")
      .then((dish) => {
        return res.status(200).json(dish);
      })
      .catch((err) => next(err));
  })
  .post([verifyUser, verifyAdmin], (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put([verifyUser, verifyAdmin], (req, res, next) => {
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
  .delete([verifyUser, verifyAdmin], (req, res, next) => {
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
      .populate("comments.author")
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
  .post(verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          req.body.author = req.user._id;
          dish.comments.push(req.body);
          dish.save().then(
            (dish) => {
              Dishes.findById(dish._id)
                .populate("comments.author")
                .then((dish) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(dish);
                });
            },
            (err) => next(err)
          );
        } else {
          err = new Error("Dish " + req.params.dishId + " not found");
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => console.log(err));
  })
  .put(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /dishes");
  })
  .delete([verifyUser, verifyAdmin], (req, res, next) => {
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
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put(verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            const author_id = dish.comments.id(req.params.commentId).author._id;

            if (author_id.toString() === req.user._id.toString()) {
              if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
              }

              if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment =
                  req.body.comment;
              }

              dish.save().then(
                (dish) => {
                  Dishes.findById(dish._id)
                    .populate("comments.author")
                    .then((dish) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(dish);
                    });
                },
                (err) => next(err)
              );
            } else {
              err = new Error("You are not permitted to update this comment");
              err.status = 404;
              return next(err);
            }
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            const author_id = dish.comments.id(req.params.commentId).author._id;
            if (author_id.toString() === req.user._id.toString()) {
              dish.comments.id(req.params.commentId).remove();
              dish.save().then(
                (dish) => {
                  Dishes.findById(dish._id)
                    .populate("comments.author")
                    .then((dish) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(dish);
                    });
                },
                (err) => next(err)
              );
            } else {
              err = new Error("You are not permitted to Delete this comment");
              err.status = 404;
              return next(err);
            }
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = dishRoutes;
