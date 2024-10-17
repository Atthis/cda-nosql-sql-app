function getActors(db) {
  const sql = "SELECT * FROM actors";

  return new Promise(function (resolve, reject) {
    db.all(sql, [], function (err, rows) {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

async function getActorById(db, id) {
  const sql = "SELECT * FROM actors WHERE id = ?";

  return new Promise(function (resolve, reject) {
    db.all(sql, [id], function (err, rows) {
      if (err) {
        reject(err)
      } else {
        resolve(rows[0])
      }
    })
  })
}

module.exports = {
  getActors,
  getActorById
}