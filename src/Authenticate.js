const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const Users = require("./Models/Users");

const config = require("../config");

exports.local = passport.use(new LocalStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// jwt
exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600,
  });
};

let options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    Users.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    err = new Error("You are not authorized to perform this operation!");
    err.statusCode = 403;
    next(err);
    // return res.status(403).send(err);
  }
};
