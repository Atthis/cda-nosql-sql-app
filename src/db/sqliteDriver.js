const path = require('path');
const sqlite3 = require('sqlite3').verbose()
const db_name = path.join(__dirname, "database.db");
const sqliteDB = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connexion réussie à la base de données 'database.db'");
});

module.exports = sqliteDB;

