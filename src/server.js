const express = require('express');
const app = express();
const port = 3000;

const { homeView } = require('./views/rootPage.js')

const sqlite = require('./routes/sqliteRouter');
const mongodb = require('./routes/mongoRouter');

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const page = homeView();
  res.send(page)
})

app.use('/sqlite', sqlite);
app.use('/mongo', mongodb);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
