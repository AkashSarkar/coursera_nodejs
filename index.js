const express = require("express");

const MongoClient = require("mongodb");
const dboper = require("./operations");

const mongoose = require("mongoose");

const Dishes = require("./src/Models/Dishes");

const url = "mongodb://localhost:27017/coursera";

const connect = mongoose.connect(url);

const dishRoutes = require("./src/dishRouter");
const leaderRouters = require("./src/leaderRouter");
const promoRoutes = require("./src/promoRouter");

connect.then((db) => {
  console.log("connected");
  Dishes.create({
    name: "Test 1",
    description: "test1",
  })
    .then((dish) => {
      console.log(dish);
      return Dishes.find({}).exec();
    })
    .then((dishes) => {
      console.log(dishes);
      return Dishes.deleteMany({});
    })
    .then(() => {
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
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

app.use("/dishes", dishRoutes);
app.use("/promotions", promoRoutes);
app.use("/leaders", leaderRouters);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
