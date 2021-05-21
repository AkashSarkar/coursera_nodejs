const express = require("express");
const Leaders = require("../Models/Leaders");

const leaderRouters = express.Router();

leaderRouters
  .route("/")
  .get((req, res) => {
    Leaders.find({})
      .then((leader) => {
        return res.status(200).json(leader);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        return res.status(201).json({
          status: "success",
          promo: leader,
        });
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /leaders");
  })
  .delete((req, res, next) => {
    Leaders.deleteMany({})
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => next(err));
  });

leaderRouters
  .route("/:leaderId")
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        return res.status(200).json(leader);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.leaderId
    );
  })
  .put((req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((leader) => {
        return res.status(201).json(leader);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => next(err));
  });

module.exports = leaderRouters;
