const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  tag: {
    type: Array
  }
});

const Topic = mongoose.model('Topic', TopicSchema);
module.exports = Topic;
