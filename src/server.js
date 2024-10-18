const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const { homeView } = require('./views/rootPage.js')

const sqlite = require('./routes/sqliteRouter');
const mongodb = require('./routes/mongoRouter');

// app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "static")))

app.get('/', (req, res) => {
  const page = homeView();
  res.send(page)
})

app.use('/sqlite', sqlite);
app.use('/mongo', mongodb);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
