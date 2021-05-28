const express = require("express");
const { verifyUser, verifyAdmin } = require("../src/Authenticate");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only Image files"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRoutes = express.Router();

uploadRoutes
  .route("/")
  .get([verifyUser, verifyAdmin], (req, res, next) => {
    res.statusCode = 403;
    res.send("GET operation not supported on /imageUpload");
  })
  .post([verifyUser, verifyAdmin, upload.single("imageFile")], (req, res) => {
    res.statusCode = 200;
    res.json(req.file);
  })
  .put([verifyUser, verifyAdmin], (req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /imageUpload");
  })
  .delete([verifyUser, verifyAdmin], (req, res, next) => {
    res.statusCode = 403;
    res.send("DELETE operation not supported on /imageUpload");
  });

module.exports = uploadRoutes;
