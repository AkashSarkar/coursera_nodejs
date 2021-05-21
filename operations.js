exports.insertDocument = (db, document, collection, callback) => {
  const coll = db.collection(collection);
  coll.insert(document, (err, result) => {
    console.log("inserted" + result.result.n);
    callback(result);
  });
};
exports.findDocuments = (db, collection, callback) => {
  const coll = db.collection(collection);
  coll.find({}).toArray((err, docs) => {
    callback(docs);
  });
};
exports.removeDocument = (db, document, collection, callback) => {
  const coll = db.collection(collection);
  coll.deleteOne(document, (err, result) => {
    console.log("removed one" + document);
    callback(result);
  });
};
exports.updateDocument = (db, document, update, collection, callback) => {
  const coll = db.collection(collection);
  coll.updateOne(document, { $set: update }, null, (err, res) => {
    console.log("updated");
    callback(res);
  });
};
