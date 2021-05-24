const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const Users = require("./Models/Users");

exports.local = passport.use(new LocalStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());
