const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gomix', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  console.log('Connected to Gomix database');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// serve static files from /public
app.use(express.static(`${__dirname}/template`));

// include routes
const routes = require('./routes/router');

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// listen on port 8000
app.listen(8000, () => {
  console.log('Express app listening on port 8000');
});
