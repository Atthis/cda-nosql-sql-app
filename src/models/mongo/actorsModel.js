const mongo = require('mongodb');

async function getActors(db) {
  const data = await db.run('actors').then(async coll => {
    const cursor = coll.find();
    const result = await cursor.toArray();
    return { result, cursor };
  });
  data.cursor.close();

  return data.result;
}

async function getActorById(db, id) {
  const filter = { _id: mongo.ObjectId.createFromHexString(id) };

  const data = await db.run('actors').then(async coll => {
    const result = coll.findOne(filter);
    return result;
  });

  return data;
}

async function updateActor(db, id, formData) {
  const actorId = { _id: mongo.ObjectId.createFromHexString(id) };

  const updatedActorInfo = await db.run('actors').then(async coll => {
    return coll.updateOne(actorId, {
      $set: formData,
    });
  });

  let updatedMoviesInfos;

  if(Object.keys(formData).includes('name')) {
  updatedMoviesInfos = await db.run('movies').then(coll => {
    return coll.updateMany(
        {
          "actors.id": actorId._id
        },
        {
          $set: { "actors.$.name": formData.name }
        }
      )
  })
  }

  return {updatedActorInfo, updatedMoviesInfos};
}

module.exports = {
  getActors,
  getActorById,
  updateActor,
};
