function getIndex({movies}) {
  let moviesList = ``;
  movies.forEach(movie => {
    const movieCard = `
      <div>
        <h2>${movie.title}</h2>
        <p>date de sortie : ${movie.releaseDate}</p>
        <a href="movies/${movie._id ? movie._id : movie.id}">Voir la fiche du film ${movie.title}</a>
      </div>
    `;

    moviesList += movieCard;
  })

  return `
      <h1>Les films de la vidéothèque</h1>
      <section className="movies-section">
        ${moviesList}
      </section>
  `
}

module.exports = {
  getIndex
}