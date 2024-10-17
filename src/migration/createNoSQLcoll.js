const { mongoClient } = require('../db/mongoDriver.js');

Promise.all([
  mongoClient.database.createCollection('movies'),
  mongoClient.database.createCollection('genres'),
  mongoClient.database.createCollection('actors'),
  mongoClient.database.createCollection('directors'),
  mongoClient.database.createCollection('studios')])
.then(() => mongoClient.close())
