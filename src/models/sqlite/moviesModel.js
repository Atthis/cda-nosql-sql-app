function formatColumnSuffix(string) {
  const capitalizedString = string.charAt(0).toUpperCase() + string.slice(1);
  const formatedString = capitalizedString.substring(0, capitalizedString.length - 1);
  return formatedString;
}

function formatResult(data) {
  const formatedData = JSON.parse(data);

  if (formatedData.length >= 0) {
    formatedData.forEach((el, i) => {
      formatedData[i] = JSON.parse(el);
    });
  }

  return formatedData;
}

function getMovies(db) {
  const sql = 'SELECT * FROM movies';

  return new Promise(function (resolve, reject) {
    db.all(sql, [], function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getMoviesWithAllData(db) {
  const sql = `
    select m.id , m.title , m.description , m.releaseDate ,
      json_group_array (DISTINCT a2.actor) AS actors,
      json_group_array (DISTINCT d2.director) AS directors,
      json_group_array (DISTINCT g2.genre) AS genres,
      json_group_array (DISTINCT s2.studio) AS studios
    from movies m
      JOIN (
        SELECT JSON_OBJECT('id', a.id, 'name', a.name) AS actor, ma.idMovie AS idMovie FROM actors a JOIN movies_actors ma ON ma.idActor = a.id
      ) a2 ON a2.idMovie = m.id
      JOIN (
        SELECT JSON_OBJECT('id', d.id, 'name', d.name) AS director, md.idMovie AS idMovie FROM directors d join movies_directors md on md.idDirector = d.id
      ) d2 ON d2.idMovie = m.id
      JOIN (
        SELECT JSON_OBJECT('id', g.id, 'name', g.name) AS genre, mg.idMovie AS idMovie FROM genres g join movies_genres mg on mg.idGenre = g.id
      ) g2 ON g2.idMovie = m.id
      JOIN (
        SELECT JSON_OBJECT('id', s.id, 'name', s.name) AS studio, ms.idMovie AS idMovie FROM studios s join movies_studios ms on ms.idStudio = s.id
      ) s2 ON s2.idMovie = m.id
    group by m.id;
  `;

  return new Promise(function (resolve, reject) {
    db.all(sql, [], function (err, rows) {
      if (err) {
        reject(err);
      } else {
        const results = rows;

        const formatedResults = [];

        results.forEach(result => {
          const formatedData = {
            ...result,
            actors: formatResult(result.actors),
            directors: formatResult(result.directors),
            genres: formatResult(result.genres),
            studios: formatResult(result.studios),
          };

          formatedResults.push(formatedData);
        });

        resolve(formatedResults);
      }
    });
  });
}

function getMovieById(db, id) {
  const sql = `
    select m.id , m.title , m.description , m.releaseDate ,
      json_group_array(DISTINCT a2.actor) AS actors,
      json_group_array(DISTINCT d2.director) AS directors,
      json_group_array(DISTINCT g2.genre) AS genres,
      json_group_array(DISTINCT s2.studio) AS studios
    from movies m
      JOIN (
        SELECT JSON_OBJECT('id', a.id, 'name', a.name) AS actor, ma.idMovie AS idMovie FROM actors a JOIN movies_actors ma ON ma.idActor = a.id
      ) a2 ON a2.idMovie = m.id
      JOIN (
        SELECT JSON_OBJECT('id', d.id, 'name', d.name) AS director, md.idMovie AS idMovie FROM directors d join movies_directors md on md.idDirector = d.id
      ) d2 ON d2.idMovie = m.id
      JOIN (
        SELECT JSON_OBJECT('id', g.id, 'name', g.name) AS genre, mg.idMovie AS idMovie FROM genres g join movies_genres mg on mg.idGenre = g.id
      ) g2 ON g2.idMovie = m.id
      JOIN (
        SELECT JSON_OBJECT('id', s.id, 'name', s.name) AS studio, ms.idMovie AS idMovie FROM studios s join movies_studios ms on ms.idStudio = s.id
      ) s2 ON s2.idMovie = m.id
    where m.id = ?
    group by m.id;
  `;

  return new Promise(function (resolve, reject) {
    db.all(sql, id, async function (err, rows) {
      if (err) {
        reject(err);
      } else {
        if (rows.length <= 0) {
          resolve({ result: null });
        } else {
          const result = await rows[0];

          const formatedData = {
            ...result,
            actors: formatResult(result.actors),
            directors: formatResult(result.directors),
            genres: formatResult(result.genres),
            studios: formatResult(result.studios),
          };

          resolve(formatedData);
        }
      }
    });
  });
}

async function getMoviesByActorId(db, actorId) {
  const sql = `
    select m.id , m.title
    from movies m
      left join movies_actors ma on ma.idMovie = m.id
    where ma.idActor = ?;
  `;

  return new Promise(function (resolve, reject) {
    db.all(sql, actorId, async function (err, rows) {
      if (err) {
        reject(err);
      } else {
        if (rows.length <= 0) {
          resolve({ result: null });
        } else {
          const result = await rows;
          resolve(result);
        }
      }
    });
  });
}

async function updateMovie(db, id, formData) {
  let currentData = {};
  let insertedData = {};
  let deletedData = {};

  let updatedRootColumns = [];

  // pour chaque donnée associée (ayant une table de liaison)
  for (let formDataKey in formData) {
    // si la clé est une donnée propre au film, on sort
    if (formDataKey === 'title' || formDataKey === 'description' || formDataKey === 'releaseDate') {
      updatedRootColumns.push(formDataKey);
      continue;
    }

    // récupération des données de la base
    const sql = `
      SELECT ma.id${formatColumnSuffix(formDataKey)}
      FROM movies_${formDataKey} ma
      WHERE ma.idMovie = ?;
    `;
    const associatedData = await new Promise(function (resolve, reject) {
      db.all(sql, id, async function (err, rows) {
        if (err) {
          reject(err);
        } else {
          if (rows.length <= 0) {
            resolve({ result: null });
          } else {
            const result = await rows;
            resolve(result);
          }
        }
      });
    });

    // on ne conserve que les ids
    currentData[formDataKey] = [];
    associatedData.forEach(data => currentData[formDataKey].push(data[`id${formatColumnSuffix(formDataKey)}`]));

    // on trie les id à ajouter et ceux à supprimer
    const insertedValues = formData[formDataKey].filter(data => !currentData[formDataKey].includes(data));
    const deletedValues = currentData[formDataKey].filter(data => !formData[formDataKey].includes(data));

    // si il y a des données à ajouter/supprimer, on les ajoute aux objets correspondants
    if (insertedValues.length > 0) {
      insertedData[formDataKey] = insertedValues;
    }

    if (deletedValues.length > 0) {
      deletedData[formDataKey] = deletedValues;
    }

    console.log(formDataKey);
    console.log('new', formData[formDataKey]);
    console.log('current', currentData[formDataKey]);
  }

  let updateInfo;
  let insertionInfo = {};
  let deletionInfo = {};

  // modification des données propres au film
  if(updatedRootColumns.length > 0){
    let rootDataSQLValuesString = '';
    let newRootData= [];

    updatedRootColumns.forEach((column, i) => {
      rootDataSQLValuesString += `${column} = ?`;
      newRootData.push(formData[column]);
      if(i < updatedRootColumns.length -1) {
        rootDataSQLValuesString += ', '
      }
    })

    const sql = `
      UPDATE movies
      SET ${rootDataSQLValuesString}
      WHERE id = ?
      RETURNING *;
    `;

    updateInfo = await new Promise(function (resolve, reject) {
      db.all(sql, [...newRootData, id], async function (err, rows) {
        if (err) {
          reject(err);
        } else {
          if (rows.length <= 0) {
            resolve({ result: null });
          } else {
            const result = await rows;
            resolve(result);
          }
        }
      });
    });
  }

  // insertion des nouvelles données dans la base
  for (let key in insertedData) {
    let insertedValuesString = '';
    let insertedSQLData = [];

    insertedData[key].forEach((value, i) => {
      insertedValuesString += '(?, ?)';
      insertedSQLData.push(...[id, value]);
      if (i < insertedData[key].length - 1) {
        insertedValuesString += ', ';
      }
    });
    const sql = `
      INSERT INTO movies_${key} (idMovie, id${formatColumnSuffix(key)})
      VALUES ${insertedValuesString}
      RETURNING idMovie, id${formatColumnSuffix(key)};
    `;
    insertionInfo[key] = await new Promise(function (resolve, reject) {
      db.all(sql, insertedSQLData, async function (err, rows) {
        if (err) {
          reject(err);
        } else {
          if (rows.length <= 0) {
            resolve({ result: null });
          } else {
            const result = await rows;
            resolve(result);
          }
        }
      });
    });
  }

  // suppression des données dans la base
  for (let key in deletedData) {
    let deletedValuesString = '';
    let deletedSQLData = [];

    deletedData[key].forEach((value, i) => {
      deletedValuesString += '?';
      deletedSQLData.push(value);
      if (i < deletedData[key].length - 1) {
        deletedValuesString += ', ';
      }
    });
    const sql = `
      DELETE FROM movies_${key}
      WHERE idMovie = ? AND id${formatColumnSuffix(key)} IN (${deletedValuesString})
      RETURNING idMovie, id${formatColumnSuffix(key)};
    `;

    deletionInfo[key] = await new Promise(function (resolve, reject) {
      db.all(sql, [id, ...deletedSQLData], async function (err, rows) {
        if (err) {
          reject(err);
        } else {
          if (rows.length <= 0) {
            resolve({ result: null });
          } else {
            const result = await rows;
            resolve(result);
          }
        }
      });
    });
  }

  return { updateInfo, insertionInfo, deletionInfo };
}

module.exports = {
  getMovies,
  getMoviesWithAllData,
  getMovieById,
  getMoviesByActorId,
  updateMovie,
};
