const sqliteDB = require('../db/sqliteDriver');

sqliteDB.serialize(() => {

  sqliteDB.run("BEGIN TRANSACTION");

  sqliteDB.run(`
          create table if not exists movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
              title NVARCHAR(255) NOT NULL,
              description TEXT NOT NULL,
              releaseDate DATE NOT NULL
          );
      `, (err) => {
      if (err) {
          console.log(`ERROR: on created movies table : ${err}`);
      } else {
          console.log('INFO: movies table created or updated');
      }
  });

  sqliteDB.run(`
          create table if not exists genres (
            id INTEGER Primary key autoincrement,
            name NVARCHAR(32)
          );
      `, (err) => {
      if (err) {
          console.log(`ERROR: on created genres table : ${err}`);
      } else {
          console.log('INFO: genres table created or updated');
      }
  });

  sqliteDB.run(`
          create table if not exists directors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name NVARCHAR(255) NOT NULL,
            biography TEXT NOT NULL
          );
      `, (err) => {
      if (err) {
          console.log(`ERROR: on created directors table : ${err}`);
      } else {
          console.log('INFO: directors table created or updated');
      }
  });

  sqliteDB.run(`
      create table if not exists actors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
          name NVARCHAR(255) NOT NULL,
          biography TEXT NOT NULL
      );
    `, (err) => {
    if (err) {
        console.log(`ERROR: on created actors table : ${err}`);
    } else {
        console.log('INFO: actors table created or updated');
    }
  });

  sqliteDB.run(`
        create table if not exists studios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name NVARCHAR(255),
          country NVRACHAR(255)
        );
    `, (err) => {
    if (err) {
        console.log(`ERROR: on created studios table : ${err}`);
    } else {
        console.log('INFO: studios table created or updated');
    }
  });

  sqliteDB.run(`
          create table if not exists movies_genres (
            idMovie INTEGER not null,
            idGenre INTEGER not null,
            FOREIGN KEY (idMovie) REFERENCES movies(id),
            FOREIGN KEY (idGenre) REFERENCES genres(id),
            CONSTRAINT PK_movie_genre PRIMARY KEY(idMovie, idGenre)
          );
      `, (err) => {
      if (err) {
          console.log(`ERROR: on created movies_genres table : ${err}`);
      } else {
          console.log('INFO: movies_genres table created or updated');
      }
  });

  sqliteDB.run(`
          create table if not exists movies_directors (
            idMovie INTEGER not null,
            idDirector INTEGER not null,
            FOREIGN KEY (idMovie) REFERENCES movies(id),
            FOREIGN KEY (idDirector) REFERENCES directors(id),
            CONSTRAINT PK_movie_director PRIMARY KEY(idMovie, idDirector)
          );
      `, (err) => {
      if (err) {
          console.log(`ERROR: on created movies_directors table : ${err}`);
      } else {
          console.log('INFO: movies_directors table created or updated');
      }
  });

  sqliteDB.run(`
        create table if not exists movies_actors (
          idMovie INTEGER not null,
          idActor INTEGER not null,
          FOREIGN KEY (idMovie) REFERENCES movies(id),
          FOREIGN KEY (idActor) REFERENCES actors(id),
          CONSTRAINT PK_movie_actor PRIMARY KEY(idMovie, idActor)
        );
      `, (err) => {
      if (err) {
          console.log(`ERROR: on created movies_actors table : ${err}`);
      } else {
          console.log('INFO: movies_actors table created or updated');
      }
  });

  sqliteDB.run(`
          create table if not exists movies_studios (
            idMovie INTEGER not null,
            idStudio INTEGER not null,
            FOREIGN KEY (idMovie) REFERENCES movies(id),
            FOREIGN KEY (idStudio) REFERENCES studios(id),
            CONSTRAINT PK_movie_studio PRIMARY KEY(idMovie, idStudio)
          );
      `, (err) => {
      if (err) {
          console.log(`ERROR: on created movies_studios table : ${err}`);
      } else {
          console.log('INFO: movies_studios table created or updated');
      }
  });

  sqliteDB.run("COMMIT", (err) => {
      if (err) {
          console.log(`ERROR: on created or updated database : ${err}`);
      } else {
          console.log('INFO: database created or updated');
      }
  });
});

sqliteDB.close()