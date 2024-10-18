const express = require('express');
const router = express.Router();


const { mongoClient } = require('../db/mongoDriver');

const { getMovies, getMovieById, getMoviesByActorId, updateMovie } = require('../models/mongo/moviesModel.js')

const { getActors, updateActor, getActorById } = require('../models/mongo/actorsModel.js')

const { generateBaseMongo } = require('../views/baseMongo.js')
const { generateAddForm } = require('../views/addForm.js')
const { getIndex } = require('../views/home.js')
const { generateMovieCard } = require('../views/movie.js');
const { generateActorCard } = require('../views/actor.js');

router.get('/', async function(req, res) {
  const data = {};
  data.movies = await getMovies(mongoClient);

  const body = getIndex(data);
  const page = generateBaseMongo('tous les films', body)

  res.send(page);
})

router.get('/movies/:id', async function(req, res) {
  const movieId = req.params.id;

  const data = {};

  data.movie = await getMovieById(mongoClient, movieId);

  const body = generateMovieCard(data);
  const page = generateBaseMongo(data.movie.title, body);

  res.send(page)
})

router.get('/movies/:id/update', async function(req, res) {
  const movieId = req.params.id;

  const result = await updateMovie(mongoClient, movieId, {title: "mon mega film", actors: [{id: "670fbb656722eb7facbd188f", name: "Houyo"}, {id: "670fbb656722eb7facbd1890", name: "Joseph Gordon-Levitt"}, {id: "670fbb656722eb7facbd1892", name: "Marlon Brando"}]});

  console.log(result)
  res.json(result)
})

router.get('/add', async function(req, res) {
  const data = {};
  data.actors = await getActors(mongoClient);

  const body = generateAddForm(data);
  const page = generateBaseMongo('ajouter un film', body);

  res.send(page);
})

router.post('/add', function(req, res) {
  const body = req.body;
  console.log(body)
  setTimeout(() => res.redirect('/mongo'), 2000)
  // res.redirect('/mongo')
})

router.get('/actors/:id', async function(req, res) {
  const actorId = req.params.id;

  const data = {};

  data.actor = await getActorById(mongoClient, actorId);
  data.actor.movies = await getMoviesByActorId(mongoClient, actorId);

  const body = generateActorCard(data);
  const page = generateBaseMongo(data.actor.name, body);

  res.send(page)
})

router.get('/actor/:id/update', async function(req, res) {
  const actorId = req.params.id;

  const result = await updateActor(mongoClient, actorId, {biography: "Acteur célèbre connu pour ses rôles dans des films primés!!!!", name: "Houyo"});

  res.json(result)
})

module.exports = router;