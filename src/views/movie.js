function generateMovieCard({movie}) {
  const actors = movie.actors;
  let actorsList = ``;

  actors.forEach(actor => {
    const actorLine = `
      <li>
        <a href="actors/${actor._id ? actor._id : actor.id}">${actor.name}</a>
      </li>
    `;

    actorsList += actorLine;
  })

  return `
    <a href="">revenir à la liste de films</a>
    <h1>${movie.title}</h1>
    <p>${movie.description}</p>
    <p>Date de sortie : ${movie.releaseDate}</p>
    <h2>Acteurs :</h2>
    <ul>
      ${actorsList}
    </ul>
  `
}

module.exports = {
  generateMovieCard
}