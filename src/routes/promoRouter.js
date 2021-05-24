const express = require("express");
const { verifyUser, verifyAdmin } = require("../Authenticate");
const Promotions = require("../Models/Promotions");

const promoRoutes = express.Router();

promoRoutes
  .route("/")
  .get((req, res) => {
    Promotions.find({})
      .then((promos) => {
        return res.status(200).json(promos);
      })
      .catch((err) => next(err));
  })
  .post([verifyUser, verifyAdmin], (req, res, next) => {
    Promotions.create(req.body)
      .then((promo) => {
        return res.status(201).json({
          status: "success",
          promo: promo,
        });
      })
      .catch((err) => next(err));
  })
  .put([verifyUser, verifyAdmin], (req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /promos");
  })
  .delete([verifyUser, verifyAdmin], (req, res, next) => {
    Promotions.deleteMany({})
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => next(err));
  });

promoRoutes
  .route("/:promoId")
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then((promo) => {
        return res.status(200).json(promo);
      })
      .catch((err) => next(err));
  })
  .post([verifyUser, verifyAdmin], (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promoId
    );
  })
  .put([verifyUser, verifyAdmin], (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promoId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((promo) => {
        return res.status(201).json(promo);
      })
      .catch((err) => next(err));
  })
  .delete([verifyUser, verifyAdmin], (req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promoId)
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => next(err));
  });

module.exports = promoRoutes;
