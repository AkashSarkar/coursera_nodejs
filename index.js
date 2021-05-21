const express = require("express");

const MongoClient = require("mongodb");
const dbOp = require("./operations");

const url = "mongodb://localhost:27017/";
const dbName = "coursera";

const dishRoutes = require("./src/dishRouter");
const leaderRouters = require("./src/leaderRouter");
const promoRoutes = require("./src/promoRouter");

MongoClient.connect(url, (err, client) => {
  console.log("connected correctly to db");
  const db = client.db(dbName);
  dbOp.insertDocument(
    db,
    { name: "ass", description: "ada" },
    "dishes",
    (res) => {
      console.log(res);
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
