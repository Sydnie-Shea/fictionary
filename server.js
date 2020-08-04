const Game = require('./game.js');
const Player = require('./player.js');

const io = require('socket.io')(3000)

const users = {}


//actually create dictionary class
const game = new Game("None");

io.on('connection', socket => {
  socket.on('new-user', name => {
    console.log("user arrived");
    users[socket.id] = new Player(name);
    game.addPlayer(users[socket.id]);
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    game.removePlayer(users[socket.id]);
    delete users[socket.id]
  })
})