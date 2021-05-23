const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const MongoClient = require("mongodb");
const dboper = require("./operations");

const mongoose = require("mongoose");

const Dishes = require("./src/Models/Dishes");

const url = "mongodb://localhost:27017/coursera";

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const dishRoutes = require("./src/routes/dishRouter");
const leaderRouters = require("./src/routes/leaderRouter");
const promoRoutes = require("./src/routes/promoRouter");
const userRoutes = require("./src/routes/userRouter");

connect
  .then((db) => {
    console.log("connected");
    //   Dishes.create({
    //     name: "Uthappizza",
    //     description: "test",
    //   })
    //     .then((dish) => {
    //       console.log(dish);

    //       return Dishes.findByIdAndUpdate(
    //         dish._id,
    //         {
    //           $set: { description: "Updated test" },
    //         },
    //         {
    //           new: true,
    //         }
    //       ).exec();
    //     })
    //     .then((dish) => {
    //       console.log(dish);

    //       dish.comments.push({
    //         rating: 5,
    //         comment: "I'm getting a sinking feeling!",
    //         author: "Leonardo di Carpaccio",
    //       });

    //       return dish.save();
    //     })
    //     .then((dish) => {
    //       console.log(dish);

    //       return Dishes.remove({});
    //     })
    //     .then(() => {
    //       return mongoose.connection.close();
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
  })
  .catch((err) => {
    console.log(err);
  });

// MongoClient.connect(url)
//   .then((client) => {
//     console.log("Connected correctly to server");
//     const db = client.db(dbname);

//     dboper
//       .insertDocument(db, { name: "Vadonut", description: "Test" }, "dishes")
//       .then((result) => {
//         console.log("Insert Document:\n", result.ops);

//         return dboper.findDocuments(db, "dishes");
//       })
//       .then((docs) => {
//         console.log("Found Documents:\n", docs);

//         return dboper.updateDocument(
//           db,
//           { name: "Vadonut" },
//           { description: "Updated Test" },
//           "dishes"
//         );
//       })
//       .then((result) => {
//         console.log("Updated Document:\n", result.result);

//         return dboper.findDocuments(db, "dishes");
//       })
//       .then((docs) => {
//         console.log("Found Updated Documents:\n", docs);

//         return db.dropCollection("dishes");
//       })
//       .then((result) => {
//         console.log("Dropped Collection: ", result);

//         return client.close();
//       })
//       .catch((err) => console.log(err));
//   })
//   .catch((err) => console.log(err));

const port = 3000;
const app = express();

app.use(express.json());
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use("/users", userRoutes);

function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    var err = new Error("You are not authenticated!");
    err.status = 403;
    return next(err);
  } else {
    if (req.session.user === "authenticated") {
      next();
    } else {
      var err = new Error("You are not authenticated!");
      err.status = 403;
      return next(err);
    }
  }
}

app.use(auth);

app.use("/dishes", dishRoutes);
app.use("/promotions", promoRoutes);
app.use("/leaders", leaderRouters);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
