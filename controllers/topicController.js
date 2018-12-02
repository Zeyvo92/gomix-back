const Topic = require('../model/topic');

// create new topic
exports.createTopic = (req, res, next) => {
  if (req.body.title) {
    const topicData = {
      title: req.body.title,
      description: (req.body.description) ? req.body.description : null,
      tag: (req.body.tag) ? req.body.tag : [],
    };
    Topic.create(topicData, (err, topic) => { // eslint-disable-line no-shadow
      if (err) {
        err.status = 400; // eslint-disable-line no-param-reassign
        return next(err);
      }
      res.status(201).json({ id: topic._id }); // eslint-disable-line no-underscore-dangle
    });
  } else {
    const err = new Error('Title is required to create Topic');
    err.status = 400;
    return next(err);
  }
};
