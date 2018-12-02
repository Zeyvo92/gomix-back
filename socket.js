const Message = require('./model/message');
const User = require('./model/user');

module.exports = (server) => {
  /*if (!req.session.userId) {
    return res.status(401).send('Please login');
  }*/
  const io = require('socket.io').listen(server);
  io.on('connection', (socket) => {
    console.log('[SOCKET IO] New connection');
    socket.on('joinTopic', (data) => {
      socket.join(data.topicId);
      Message.find({ topicId: data.topicId }, (err, msg) => {
        if (err) throw err;
        socket.emit('messageHistory', msg);
      }).limit(20);
    });
    socket.on('leaveTopic', (data) => {
      socket.leave(data.topicId);
    });
    socket.on('message', (data) => {
      User.findById(data.userId, (err, user) => {
        if (err) throw err;
        io.to(data.topicId).emit('newMessage', { email: user.email, msg: data.msg });
      });
      const messageData = {
        userId: data.userId,
        topicId: data.topicId,
        text: data.msg,
      };
      Message.create(messageData, (err, msg) => {
        if (err) throw err;
      });
    });
  });
};
