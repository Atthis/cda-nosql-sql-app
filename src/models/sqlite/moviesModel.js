function formatResult(data) {
  const formatedData = JSON.parse(data);

  if(formatedData.length >= 0) {
    formatedData.forEach((el, i) => {
      formatedData[i] = JSON.parse(el);
    })
  }

  return formatedData
}

function getMovies(db) {
  const sql = "SELECT * FROM movies";

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
        reject(err)
      } else {
        const results = rows;

        const formatedResults = []

        results.forEach(result => {
          const formatedData = {
            ...result,
            actors: formatResult(result.actors),
            directors: formatResult(result.directors),
            genres: formatResult(result.genres),
            studios: formatResult(result.studios),
          }

          formatedResults.push(formatedData);
        })

        resolve(formatedResults)
      }
    })
  })
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
        reject(err)
      } else {
        if (rows.length <= 0) {
          resolve({result: null})
        } else {
          const result = await rows[0];

          const formatedData = {
            ...result,
            actors: formatResult(result.actors),
            directors: formatResult(result.directors),
            genres: formatResult(result.genres),
            studios: formatResult(result.studios),
          }

          resolve(formatedData)
        }
      }
    })
  })
}

module.exports = {
  getMovies,
  getMoviesWithAllData,
  getMovieById
}