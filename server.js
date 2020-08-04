const Game = require('./game.js');
const Player = require('./player.js');
const Dictionary = require('./dictionary.js');

const io = require('socket.io')(3000)

const users = {}


//actually create dictionary class
const dictionary = new Dictionary();
const game = new Game(dictionary);

io.on('connection', socket => {
  socket.on('new-user', name => {
    console.log("user arrived");
    users[socket.id] = new Player(socket.id, name);
    game.addPlayer(users[socket.id]);
    socket.broadcast.emit('user-connected', name);
  });


  socket.on('disconnect', name => {
    console.log("disconneting");
    socket.broadcast.emit('user-disconnected', users[socket.id].getName());
    game.removePlayer(users[socket.id]);
    delete users[socket.id]
  });

  socket.on('started', name =>{
    console.log("arriving on server side");
    holder = game.startRound().getSocketId();
    word = game.determineWord();
    gameInfo = {
      'holder': holder,
      'word': word
    };
    io.sockets.emit('round-started', gameInfo);
  });

  socket.on('new-word',() => {
    word = game.determineWord();
    socket.emit('new-word-given', word);
  });

  socket.on('word-selected', () => {
    socket.broadcast.emit('show-word', game.getCurrentWord()["word"]);
  });

  socket.on('submit-fake-def', def => {
    var currentPlayer = users[socket.id];
    console.log("currnetPlayer?");
    console.log(currentPlayer);
    console.log("should have printed");
    var defInfo = {
      'def': def,
      'playerName': currentPlayer.getName(),
      'playerId': currentPlayer.getSocketId(),
      'holder': game.getCurrentHolder().getSocketId()
    };
    game.fakeDefinition(currentPlayer, def);
    socket.broadcast.emit('fake-def-received', defInfo);
    //io.sockets.socket(game.getCurrentHolder().getSocketId()).emit('fake-def-received', defInfo);
    //io.clients[game.getCurrentHolder().getSocketId()].emit('fake-def-received', defInfo);
  });
});