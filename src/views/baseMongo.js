const path = require('path');

function generateBaseMongo(title, body) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | mongo</title>
      <link rel="stylesheet" href="/pico.classless.slate.min.css">
      <base href="/mongo/" />
    </head>
    <body>
      <a href="http://localhost:3000/">retourner à l'accueil</a>
      <main>${body}</main>
    </body>
    </html>
  `
}

module.exports = {
  generateBaseMongo
};