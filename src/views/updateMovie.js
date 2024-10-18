function generateAddForm({actors}) {
  let actorsList = ``;
  actors.forEach(actor => {
    const actorSelect = `
      <div>
        <input type="checkbox" id="${actor._id ? actor._id : actor.id}" name="actors" value="${actor._id ? actor._id : actor.id}" />
        <label for="${actor._id ? actor._id : actor.id}">${actor.name}</label>
      </div>
    `;

    actorsList += actorSelect;
  })

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ajouter un film | vidéothèque</title>
    </head>
    <body>
      <form action="./add" method="POST">
        <label for="title">Titre</label>
        <input type="text" id="title" name="title">
        <label for="description">Description</label>
        <textarea type="text" id="description" name="description"></textarea>
        <label for="release">Date de sortie</label>
        <input type="date" id="release" name="releaseDate">
        <fieldset>
          <legend>Acteurs</legend>
          ${actorsList}
        </fieldset>
        <button type="submit">Envoyer</button>
      </form>
    </body>
    </html>
  `
}

module.exports = {
  generateAddForm
}