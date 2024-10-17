const { mongoDatabase } = require('../db/mongoDriver.js');

Promise.all([
  mongoDatabase.createCollection('movies'),
  mongoDatabase.createCollection('genres'),
  mongoDatabase.createCollection('actors'),
  mongoDatabase.createCollection('directors'),
  mongoDatabase.createCollection('studios')])
.then(() => mongoDatabase.close())
