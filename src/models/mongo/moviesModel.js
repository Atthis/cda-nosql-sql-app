const mongo = require('mongodb');

async function getMovies(db) {
  const data = await db.run('movies').then(async coll => {
    const cursor = coll.find();
    const result = await cursor.toArray();
    return { result, cursor };
  });
  data.cursor.close();

  return data.result;
}

async function getMovieById(db, id) {
  const filter = { _id: mongo.ObjectId.createFromHexString(id) };

  const data = await db.run('movies').then(async coll => {
    const result = coll.findOne(filter);
    return result;
  });

  return data;
}

async function getMoviesByActorId(db, actorId) {
  const filter = { 'actors.id': mongo.ObjectId.createFromHexString(actorId) };

  const data = await db.run('movies').then(async coll => {
    const cursor = coll.find(filter);
    const result = await cursor.toArray();
    return { result, cursor };
  });
  data.cursor.close();

  return data.result;
}

async function updateMovie(db, id, formData) {
  const movieId = { _id: mongo.ObjectId.createFromHexString(id) };

  console.log(movieId)

  const updatedMovieInfos = await db.run('movies').then(async coll => {
    return coll.updateOne(movieId, {
      $set: formData,
    });
  })

  return updatedMovieInfos;
}

module.exports = {
  getMovies,
  getMovieById,
  getMoviesByActorId,
  updateMovie,
};
