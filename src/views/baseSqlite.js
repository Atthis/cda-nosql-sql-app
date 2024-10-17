function generateBaseSqlite(title, body) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | sqlite</title>
      <base href="/sqlite/" />
    </head>
    <body>
      <a href="http://localhost:3000/">retourner à l'accueil</a>
      ${body}
    </body>
    </html>
  `
}

module.exports = {
  generateBaseSqlite
};