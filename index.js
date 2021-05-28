const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const Authenticate = require("./src/Authenticate");
const config = require("./config");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");

const dishRoutes = require("./src/routes/dishRouter");
const leaderRouters = require("./src/routes/leaderRouter");
const promoRoutes = require("./src/routes/promoRouter");
const userRoutes = require("./src/routes/userRouter");

const url = config.mongoUrl;

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

connect
  .then((db) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const port = 3000;
const app = express();

app.use(express.json());

app.use(passport.initialize());

app.use("/users", userRoutes);
app.use("/dishes", dishRoutes);
app.use("/promotions", promoRoutes);
app.use("/leaders", leaderRouters);

app.set("secPort", port + 443);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const options = {
  key: fs.readFileSync(__dirname + "/private.key"),
  cert: fs.readFileSync(__dirname + "/certificate.pem"),
};

const SecureServer = https.createServer(options, app);

SecureServer.listen(app.get("secPort"), () => {
  console.log("Server listening on port" + app.get("secPort"));
});

SecureServer.on("error");
SecureServer.on("listening");
