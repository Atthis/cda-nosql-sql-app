function homeView() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vidéothèque</title>
      <link rel="stylesheet" href="/pico.classless.slate.min.css">
    </head>
    <body>
      <main>
        <h1>Accueil</h1>
        <a href="/mongo">Accéder à la base Mongo</a>
        <br />
        <a href="/sqlite">Accéder à la base SQLite</a>
      </main>
    </body>
    </html>
  `
}

module.exports = {
  homeView
}