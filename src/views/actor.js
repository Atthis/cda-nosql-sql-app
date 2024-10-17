function generateActorCard({actor}) {
  const movies = actor.movies;
  let moviesList = ``;

  movies.forEach(movie => {
    const movieLine = `
      <li>
        <a href="movies/${movie._id ? movie._id : movie.id}">${movie.title}</a>
      </li>
    `;

    moviesList += movieLine;
  })

  return `
    <a href="">revenir à la liste de films</a>
    <h1>${actor.name}</h1>
    <p>${actor.biography}</p>
    <h2>Apparences :</h2>
    <ul>
      ${moviesList}
    </ul>
  `
}

module.exports = {
  generateActorCard
}