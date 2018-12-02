const User = require('../model/user');

// create new user then redirect to profile
exports.createNewUser = (req, res, next) => {
  if (req.body.email
        && req.body.password) {
    const userData = {
      email: req.body.email,
      password: req.body.password,
    };
    User.create(userData, (error, user) => { // eslint-disable-line no-shadow
      if (error) return next(error);
      req.session.userId = user._id; // eslint-disable-line no-underscore-dangle
      return res.status(201).json({ id: user._id }); // eslint-disable-line no-underscore-dangle
    });
  } else {
    const err = new Error('Email and password are required to create account');
    err.status = 400;
    return next(err);
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
      return res.status(200).json({ id: user._id }); // eslint-disable-line no-underscore-dangle
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
      if (err) return next(err);
      return res.status(204).send();
    });
  }
};
