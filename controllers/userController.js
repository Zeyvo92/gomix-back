const User = require('../model/user');

// create new user then redirect to profile
exports.createNewUser = (req, res) => {
  if (req.body.email
        && req.body.password) {
    const userData = {
      email: req.body.email,
      password: req.body.password,
    };
    // use schema.create to insert data into the db
    User.create(userData, (err, user, next) => {
      if (err) {
        return next(err);
      }
      req.session.userId = user._id; // eslint-disable-line no-underscore-dangle
      return res.redirect('/profile');
    });
  }
};

// login user
exports.loginUser = (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }
      req.session.userId = user._id; // eslint-disable-line no-underscore-dangle
      return res.redirect('/profile');
    });
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
};

// logout user
exports.logoutUser = (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  }
};
