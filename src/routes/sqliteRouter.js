const express = require('express');
const router = express.Router();

const sqliteDB = require('../db/sqliteDriver.js');

const { getMovies, getMoviesWithAllData, getMovieById, getMoviesByActorId } = require('../models/sqlite/moviesModel.js');
const { getActors, getActorById, updateActor } = require('../models/sqlite/actorsModel.js');

const { generateBaseSqlite } = require('../views/baseSqlite.js');
const { generateAddForm } = require('../views/addForm.js');
const { getIndex } = require('../views/home.js');
const { generateMovieCard } = require('../views/movie.js');
const { generateActorCard } = require('../views/actor.js');

router.get('/', async function (req, res) {
  const data = {};
  data.movies = await getMovies(sqliteDB);

  const body = getIndex(data);
  const page = generateBaseSqlite('tous les films', body);

  res.send(page);
});

router.get('/movies', async function (req, res) {
  const results = await getMoviesWithAllData(sqliteDB);
  res.json(results);
});

router.get('/movies/:id', async function (req, res) {
  const movieId = req.params.id;

  const data = {};

  data.movie = await getMovieById(sqliteDB, movieId);

  const body = generateMovieCard(data);
  const page = generateBaseSqlite(data.movie.title, body);

  res.send(page);
});

router.get('/add', async function (req, res) {
  const data = {};
  data.actors = await getActors(sqliteDB);

  const page = generateAddForm(data);
  res.send(page);
});

router.get('/actors/:id', async function (req, res) {
  const actorId = req.params.id;

  const data = {};

  data.actor = await getActorById(sqliteDB, actorId);
  data.actor.movies = await getMoviesByActorId(sqliteDB, actorId);

  const body = generateActorCard(data);
  const page = generateBaseSqlite(data.actor.name, body);

  res.send(page);
});

router.get('/actors/:id/update', async function (req, res) {
  const actorId = req.params.id;

  const result = await updateActor(sqliteDB, actorId, { name: 'Jojo', biography: 'meilleur acteur du monde' });

  res.send(result);
});

module.exports = router;
