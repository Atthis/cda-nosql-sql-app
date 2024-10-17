const express = require('express');
const router = express.Router();


const { mongoDatabase } = require('../db/mongoDriver');

const { getMovies, getMovieById } = require('../models/mongo/moviesModel.js')

const { getActors } = require('../models/mongo/actorsModel.js')

const { generateBaseMongo } = require('../views/baseMongo.js')
const { generateAddForm } = require('../views/addForm.js')
const { getIndex } = require('../views/home.js')
const { generateMovieCard } = require('../views/movie.js')

router.get('/', async function(req, res) {
  const data = {};
  data.movies = await getMovies(mongoDatabase);

  const body = getIndex(data);
  const page = generateBaseMongo('tous les films', body)

  res.send(page);
})

router.get('/movies/:id', async function(req, res) {
  const movieId = req.params.id;

  const data = {};

  data.movie = await getMovieById(mongoDatabase, movieId);

  const body = generateMovieCard(data);
  const page = generateBaseMongo(data.movie.title, body);

  res.send(page)
})

router.get('/add', async function(req, res) {
  const data = {};
  data.actors = await getActors(mongoDatabase);

  const body = generateAddForm(data);
  const page = generateBaseMongo('ajouter un film', body);

  res.send(page);
})

router.post('/add', function(req, res) {
  const body = req.query;
  setTimeout(() => res.redirect('/mongo'), 2000)
  // res.redirect('/mongo')
})

module.exports = router;