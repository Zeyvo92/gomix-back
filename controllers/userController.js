const User = require('../model/user');

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
      return res.redirect('/profile');
    });
  }
};
