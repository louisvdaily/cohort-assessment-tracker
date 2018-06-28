const bodyParser = require('body-parser');
const express = require('express');
const db = require('./db/db');
const app = express();


// Setting our view engine.
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/categories', (req, res) => {
  // Fetch the categories then render the categories page with what we grabbed
  // from the db.
  db('categories')
  .then((categories) => {
    res.render('./categories/list-categories', {categories: categories})
  })
  .catch((error) => {
    res.status(500).send(error);
  })
});

app.get('/subcategories', (req, res) => {
  // Fetch the subcategories then render the subcategories page with what we grabbed
  // from the db.
  db('subcategories')
  .then(subcategories => {

  })
});

app.listen(8000, () => {
  console.log('App started listening on port 8000.');
})
