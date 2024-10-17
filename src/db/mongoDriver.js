const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

const mongoClient = new MongoClient(uri);
const mongoDatabase = mongoClient.db('projetNoSQL');

mongoDatabase.run = async function(collection) {
  try {
    const DBCollection = mongoDatabase.collection(collection);

    return DBCollection;
  } catch (err) {
    console.dir(err);
  }
};

mongoDatabase.close = async function() {
  await mongoClient.close();
}

module.exports = {
  mongoDatabase
};