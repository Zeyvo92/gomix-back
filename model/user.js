const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) { // eslint-disable-line func-names
  const user = this;
  bcrypt.hash(user.password, 10, (err1, hash) => {
    if (err1) {
      return next(err1);
    }
    user.password = hash;
    return next();
  });
});


// authenticate input against database
UserSchema.statics.authenticate = (email, password, callback) => {
  mongoose.model('User', UserSchema).findOne({ email })
    .exec((err, user) => {
      if (err) {
        return callback(err);
      }
      if (!user) {
        let newErr = new Error('User not found.');
        newErr.status = 401;
        return callback(newErr);
      }
      return bcrypt.compare(password, user.password, (err3, result) => {
        if (result === true) {
          return callback(null, user);
        }
        return callback();
      });
    });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
