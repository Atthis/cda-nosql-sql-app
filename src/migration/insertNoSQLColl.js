const { mongoClient } = require('../db/mongoDriver.js');

// Insertion des genres
const genres = [
  { name: 'Action' },
  { name: 'Comédie' },
  { name: 'Drame' },
  { name: 'Science-Fiction' },
  { name: 'Horreur' }
];

// Insertion des films
const movies = [
  { title: 'Inception', description: 'Un film de science-fiction complexe sur le rêve.', releaseDate: new Date('2010-07-16') },
  { title: 'The Godfather', description: 'Un drame sur la mafia.', releaseDate: new Date('1972-03-24') },
  { title: 'The Dark Knight', description: 'Un film de super-héros d\'action.', releaseDate: new Date('2008-07-18') },
  { title: 'Parasite', description: 'Une comédie noire sur les inégalités sociales.', releaseDate: new Date('2019-05-30') },
  { title: 'Get Out', description: 'Un film d\'horreur qui traite du racisme.', releaseDate: new Date('2017-02-24') }
];

// Insertion des réalisateurs
const directors = [
  { name: 'Christopher Nolan', biography: 'Réalisateur connu pour ses films complexes.' },
  { name: 'Francis Ford Coppola', biography: 'Réalisateur légendaire de la trilogie Le Parrain.' },
  { name: 'Bong Joon-ho', biography: 'Réalisateur sud-coréen, connu pour son film Parasite.' },
  { name: 'Jordan Peele', biography: 'Réalisateur et acteur connu pour Get Out.' }
];

// Insertion des acteurs
const actors = [
  { name: 'Leonardo DiCaprio', biography: 'Acteur célèbre connu pour ses rôles dans des films primés.' },
  { name: 'Joseph Gordon-Levitt', biography: 'Acteur américain connu pour ses rôles variés.' },
  { name: 'Ellen Page', biography: 'Actrice et productrice connue pour ses performances.' },
  { name: 'Marlon Brando', biography: 'Acteur emblématique du cinéma américain.' },
  { name: 'Al Pacino', biography: 'Acteur américain connu pour ses rôles dans des films cultes.' },
  { name: 'James Caan', biography: 'Acteur américain célèbre pour ses rôles dans des films classiques.' },
  { name: 'Christian Bale', biography: 'Acteur connu pour ses performances intenses.' },
  { name: 'Heath Ledger', biography: 'Acteur australien connu pour sa performance dans The Dark Knight.' },
  { name: 'Aaron Eckhart', biography: 'Acteur américain connu pour ses rôles variés.' },
  { name: 'Song Kang-ho', biography: 'Acteur sud-coréen, connu pour son rôle dans Parasite.' },
  { name: 'Choi Woo-shik', biography: 'Acteur sud-coréen connu pour son rôle dans Parasite.' },
  { name: 'Jeon Yeo-been', biography: 'Actrice sud-coréenne connue pour son rôle dans Parasite.' },
  { name: 'Daniel Kaluuya', biography: 'Acteur britannique connu pour son rôle dans Get Out.' },
  { name: 'Allison Williams', biography: 'Actrice et productrice connue pour son rôle dans Get Out.' },
  { name: 'Lil Rel Howery', biography: 'Acteur et comédien américain connu pour son rôle dans Get Out.' }
];

// Insertion des studios
const studios = [
  { name: 'Warner Bros', country: 'USA' },
  { name: 'Paramount Pictures', country: 'USA' },
  { name: 'Universal Pictures', country: 'USA' },
  { name: 'Columbia Pictures', country: 'USA' },
  { name: 'Lionsgate', country: 'USA' }
];

Promise.all([
  mongoClient.run("genres").then(coll => coll.insertMany(genres)),
  mongoClient.run("movies").then(coll => coll.insertMany(movies)),
  mongoClient.run("directors").then(coll => coll.insertMany(directors)),
  mongoClient.run("actors").then(coll => coll.insertMany(actors)),
  mongoClient.run("studios").then(coll => coll.insertMany(studios))
]).then(async () => {
  // Récupération des IDs pour les relations
  const movieIds = await mongoClient.run("movies")
  .then(async coll => {
    const results = await coll.find().toArray();
    const ids = results.map(movie => movie._id);
    return ids;
    })
  const genreIds = await mongoClient.run("genres")
  .then(async coll => {
    const results = await coll.find().toArray();
    const ids = results.map(genre => {return {id: genre._id, name: genre.name}});
     return ids;
    })
  const directorIds = await mongoClient.run("directors")
  .then(async coll => {
    const results = await coll.find().toArray();
    const ids = results.map(director => {return {id: director._id, name: director.name}});
     return ids;
    })
  const actorIds = await mongoClient.run("actors")
  .then(async coll => {
    const results = await coll.find().toArray();
    const ids = results.map(actor => {return {id: actor._id, name: actor.name}});
     return ids;
    })
  const studioIds = await mongoClient.run("studios")
  .then(async coll => {
    const results = await coll.find().toArray();
    const ids = results.map(studio => {return {id: studio._id, name: studio.name}});
     return ids;
    })

  // Insertion des relations (genres)
  const moviesGenres = [
    { movieId: movieIds[0], genreId: genreIds[3] }, // Inception -> Science-Fiction
    { movieId: movieIds[0], genreId: genreIds[0] }, // Inception -> Action
    { movieId: movieIds[1], genreId: genreIds[2] }, // The Godfather -> Drame
    { movieId: movieIds[1], genreId: genreIds[0] }, // The Godfather -> Action
    { movieId: movieIds[2], genreId: genreIds[0] }, // The Dark Knight -> Action
    { movieId: movieIds[2], genreId: genreIds[3] }, // The Dark Knight -> Science-Fiction
    { movieId: movieIds[3], genreId: genreIds[1] }, // Parasite -> Comédie
    { movieId: movieIds[3], genreId: genreIds[2] }, // Parasite -> Drame
    { movieId: movieIds[4], genreId: genreIds[4] }, // Get Out -> Horreur
    { movieId: movieIds[4], genreId: genreIds[2] }  // Get Out -> Drame
  ];

  // Insertion des relations (réalisateurs)
  const moviesDirectors = [
    { movieId: movieIds[0], directorId: directorIds[0] }, // Inception -> Christopher Nolan
    { movieId: movieIds[1], directorId: directorIds[1] }, // The Godfather -> Francis Ford Coppola
    { movieId: movieIds[2], directorId: directorIds[0] }, // The Dark Knight -> Christopher Nolan
    { movieId: movieIds[3], directorId: directorIds[2] }, // Parasite -> Bong Joon-ho
    { movieId: movieIds[4], directorId: directorIds[3] }  // Get Out -> Jordan Peele
  ];

  // Insertion des relations (acteurs)
  const moviesActors = [
    { movieId: movieIds[0], actorId: actorIds[0] }, // Inception -> Leonardo DiCaprio
    { movieId: movieIds[0], actorId: actorIds[1] }, // Inception -> Joseph Gordon-Levitt
    { movieId: movieIds[0], actorId: actorIds[2] }, // Inception -> Ellen Page
    { movieId: movieIds[1], actorId: actorIds[3] }, // The Godfather -> Marlon Brando
    { movieId: movieIds[1], actorId: actorIds[4] }, // The Godfather -> Al Pacino
    { movieId: movieIds[1], actorId: actorIds[5] }, // The Godfather -> James Caan
    { movieId: movieIds[2], actorId: actorIds[6] }, // The Dark Knight -> Christian Bale
    { movieId: movieIds[2], actorId: actorIds[7] }, // The Dark Knight -> Heath Ledger
    { movieId: movieIds[2], actorId: actorIds[8] }, // The Dark Knight -> Aaron Eckhart
    { movieId: movieIds[3], actorId: actorIds[9] }, // Parasite -> Song Kang-ho
    { movieId: movieIds[3], actorId: actorIds[10] }, // Parasite -> Choi Woo-shik
    { movieId: movieIds[3], actorId: actorIds[11] }, // Parasite -> Jeon Yeo-been
    { movieId: movieIds[4], actorId: actorIds[12] }, // Get Out -> Daniel Kaluuya
    { movieId: movieIds[4], actorId: actorIds[13] }, // Get Out -> Allison Williams
    { movieId: movieIds[4], actorId: actorIds[14] }  // Get Out -> Lil Rel Howery
  ];

  // Insertion des relations (studios)
  const moviesStudios = [
    { movieId: movieIds[0], studioId: studioIds[0] }, // Inception -> Warner Bros
    { movieId: movieIds[1], studioId: studioIds[1] }, // The Godfather -> Paramount Pictures
    { movieId: movieIds[2], studioId: studioIds[0] }, // The Dark Knight -> Warner Bros
    { movieId: movieIds[3], studioId: studioIds[2] }, // Parasite -> Universal Pictures
    { movieId: movieIds[4], studioId: studioIds[3] }  // Get Out -> Columbia Pictures
  ];

  return {moviesGenres, moviesDirectors, moviesActors, moviesStudios};
})
  .then(async ({moviesGenres, moviesDirectors, moviesActors, moviesStudios}) => {
    const promises = [];

    moviesGenres.forEach(({ movieId, genreId }) => {
      promises.push(mongoClient.run("movies")
        .then(coll => coll.updateOne(
          { _id: movieId },
          { $addToSet: { genres: genreId } }
        ))
      )
    })
    moviesDirectors.forEach(({ movieId, directorId }) => {
      promises.push(mongoClient.run("movies")
      .then(coll => coll.updateOne(
        { _id: movieId },
        { $set: { director: directorId } }
      )))
    })
    moviesActors.forEach(({ movieId, actorId }) => {
      promises.push(mongoClient.run("movies")
      .then(coll => coll.updateOne(
        { _id: movieId },
        { $addToSet: { actors: actorId } }
      )))
    })
    moviesStudios.forEach(({ movieId, studioId }) => {
      promises.push(mongoClient.run("movies")
      .then(coll => coll.updateOne(
        { _id: movieId },
        { $addToSet: { studio: studioId } }
      )))
    })

    return await Promise.all(promises)
  })
  .then(() => mongoClient.close());