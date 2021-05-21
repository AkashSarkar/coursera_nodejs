const express = require("express");

const MongoClient = require("mongodb");

const url = "mongodb://localhost:27017/";
const dbName = "coursera";

const dishRoutes = require("./src/dishRouter");
const leaderRouters = require("./src/leaderRouter");
const promoRoutes = require("./src/promoRouter");

MongoClient.connect(url, (err, client) => {
  console.log("connected correctly to db");
  const db = client.db(dbName);
  const collection = db.collection("dishes");
  
  collection.insertOne(
    {
      name: "Dish1",
      description: "This is dish q",
    },
    (err, result) => {
      console.log(result.ops);
      collection.find({}).toArray((err, docs) => {
        console.log(docs);

        db.dropCollection("dishes", (err, results) => {
          client.close();
        });
      });
    }
  );
});

const port = 3000;
const app = express();

app.use(express.json());

app.use("/dishes", dishRoutes);
app.use("/promotions", promoRoutes);
app.use("/leaders", leaderRouters);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
