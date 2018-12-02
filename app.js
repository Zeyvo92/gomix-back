const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gomix', { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  console.log('Connected to Gomix database');
});


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// serve static files from /public
app.use(express.static(`${__dirname}/template`));

app.set('trust proxy', 1);

// use sessions for tracking logins
app.use(session({
  secret: 'work_hard',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

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
app.use((err, req, res) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});


const server = require('http').Server(app);
require('./socket')(server);


// listen on port 8000
server.listen(8000, () => {
  console.log('Express app listening on port 8000');
});
