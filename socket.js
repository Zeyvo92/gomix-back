const Message = require('./model/message');
const User = require('./model/user');
const sock = require('socket.io');

module.exports = (server) => {
  /* if (!req.session.userId) {
    return res.status(401).send('Please login');
  } */
  const io = sock.listen(server);
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
        if (err || !user) throw err;
        io.to(data.topicId).emit('newMessage', { email: user.email, text: data.text });
      });
      const messageData = {
        userId: data.userId,
        topicId: data.topicId,
        text: data.text
      };
      Message.create(messageData, (err) => {
        if (err) throw err;
      });
    });
  });
};
