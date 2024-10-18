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

async function updateActor(db, id, formData) {
  const columns = Object.keys(formData);
  const values = Object.values(formData);

  let queryData = '';

  columns.forEach((column, i) => {
    queryData += `${column} = ?`
    if(i < columns.length - 1) {
      queryData += ', ';
    }
  })

  const sql = `
    UPDATE actors
    SET ${queryData}
    WHERE id = ?
  `

  return new Promise(function (resolve, reject) {
    db.all(sql, [...values, id], function (err, rows) {
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
  getActorById,
  updateActor
}