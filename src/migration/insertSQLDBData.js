const sqliteDB = require('../db/sqliteDriver');

const genres = [
  'Action',
  'Comédie',
  'Drame',
  'Science-Fiction',
  'Horreur'
]

const movies = [
  ['Inception', 'Un film de science-fiction complexe sur le rêve.', '2010-07-16'],
  ['The Godfather', 'Un drame sur la mafia.', '1972-03-24'],
  ['The Dark Knight', 'Un film de super-héros d\'action.', '2008-07-18'],
  ['Parasite', 'Une comédie noire sur les inégalités sociales.', '2019-05-30'],
  ['Get Out', 'Un film d\'horreur qui traite du racisme.', '2017-02-24']
]

const directors = [
  ['Christopher Nolan', 'Réalisateur connu pour ses films complexes.'],
  ['Francis Ford Coppola', 'Réalisateur légendaire de la trilogie Le Parrain.'],
  ['Bong Joon-ho', 'Réalisateur sud-coréen, connu pour son film Parasite.'],
  ['Jordan Peele', 'Réalisateur et acteur connu pour Get Out.']
]

const actors = [
  ['Leonardo DiCaprio', 'Acteur célèbre connu pour ses rôles dans des films primés.'],
  ['Joseph Gordon-Levitt', 'Acteur américain connu pour ses rôles variés.'],
  ['Ellen Page', 'Actrice et productrice connue pour ses performances.'],
  ['Marlon Brando', 'Acteur emblématique du cinéma américain.'],
  ['Al Pacino', 'Acteur américain connu pour ses rôles dans des films cultes.'],
  ['James Caan', 'Acteur américain célèbre pour ses rôles dans des films classiques.'],
  ['Christian Bale', 'Acteur connu pour ses performances intenses.'],
  ['Heath Ledger', 'Acteur australien connu pour sa performance dans The Dark Knight.'],
  ['Aaron Eckhart', 'Acteur américain connu pour ses rôles variés.'],
  ['Song Kang-ho', 'Acteur sud-coréen, connu pour son rôle dans Parasite.'],
  ['Choi Woo-shik', 'Acteur sud-coréen connu pour son rôle dans Parasite.'],
  ['Jeon Yeo-been', 'Actrice sud-coréenne connue pour son rôle dans Parasite.'],
  ['Daniel Kaluuya', 'Acteur britannique connu pour son rôle dans Get Out.'],
  ['Allison Williams', 'Actrice et productrice connue pour son rôle dans Get Out.'],
  ['Lil Rel Howery', 'Acteur et comédien américain connu pour son rôle dans Get Out.']
]

const studios = [
  ['Warner Bros', 'USA'],
  ['Paramount Pictures', 'USA'],
  ['Universal Pictures', 'USA'],
  ['Columbia Pictures', 'USA'],
  ['Lionsgate', 'USA']
]

const moviesGenres = [
  [1, 4],
  [1, 1],
  [2, 3],
  [2, 1],
  [3, 1],
  [3, 4],
  [4, 2],
  [4, 3],
  [5, 5],
  [5, 3]
]

const moviesDirectors = [
  [1, 1],
  [2, 2],
  [3, 1],
  [4, 3],
  [5, 4]
]

const moviesActors = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [3, 7],
  [3, 8],
  [3, 9],
  [4, 10],
  [4, 11],
  [4, 12],
  [5, 13],
  [5, 14],
  [5, 15]
]

const moviesStudios = [
  [1, 1],
  [2, 2],
  [3, 1],
  [4, 3],
  [5, 4]
]

sqliteDB.serialize(() => {
  sqliteDB.run("BEGIN TRANSACTION");

  genres.forEach((genre) =>
      sqliteDB.run(`
      INSERT INTO genres (name) VALUES (?);
      `, genre)
  );

  movies.forEach((movie) =>
      sqliteDB.run(`
      INSERT INTO movies (title, description, releaseDate)
        VALUES (?,?,?);
      `, movie)
  );

  directors.forEach((director) =>
      sqliteDB.run(`
      INSERT INTO directors (name, biography)
        VALUES (?,?);
      `, director)
  );

  actors.forEach((actor) =>
      sqliteDB.run(`
      INSERT INTO actors (name, biography)
        VALUES (?,?);
      `, actor)
  );

  studios.forEach((studio) =>
      sqliteDB.run(`
      INSERT INTO studios (name, country)
        VALUES (?,?);
      `, studio)
  );

  moviesGenres.forEach((movieGenre) =>
      sqliteDB.run(`
      INSERT INTO movies_genres (idMovie, idGenre) VALUES (?,?);
      `, movieGenre)
  );

  moviesDirectors.forEach((movieDirector) =>
      sqliteDB.run(`
      INSERT INTO movies_directors (idMovie, idDirector) VALUES (?,?);
      `, movieDirector)
  );

  moviesActors.forEach((movieActor) =>
      sqliteDB.run(`
      INSERT INTO movies_actors (idMovie, idActor) VALUES (?,?);
      `, movieActor)
  );

  moviesStudios.forEach((movieStudio) =>
      sqliteDB.run(`
      INSERT INTO movies_studios (idMovie, idStudio) VALUES (?,?);
      `, movieStudio)
  );

  sqliteDB.run("COMMIT", (err) => {
      if (err) {
          console.log(`ERROR: on populate data on database : ${err}`);
      } else {
          console.log('INFO: populate data on database OK');
      }
  });
});

sqliteDB.close()



