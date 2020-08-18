var app = require('express')();
var http = require('http').createServer(app);
var io = process.env ? require('socket.io')(http) : require('socket.io')(3000);
console.log(pprocess.env);
const Game = require('./game.js');
const Player = require('./player.js');
const Dictionary = require('./dictionary.js');

const users = {}

console.log('server running');


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
    // socket.broadcast.emit('user-disconnected', users[socket.id].getName());
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    game.removePlayer(users[socket.id]);
    // delete users[socket.id]
  });

  socket.on('started', () =>{
    console.log("arriving on server side");
    holder = game.startRound().getSocketId();
    word = game.determineWord();
    gameInfo = {
      'holder': holder,
      'word': word
    };
    console.log(gameInfo);
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
  });

  socket.on('show-fake-def', () => {
    console.log("getting to fake def");
    defs = game.getWordsToShow(users[socket.id]);
    console.log(defs);
    turnInfo = {
      'holder': users[socket.id],
      'holdersid': users[socket.id].getSocketId(),
      'defs': defs
    }
    io.sockets.emit('fake-def', turnInfo)

  });

  socket.on('guessing', guess => {
    game.guess(users[socket.id], guess);
    if (game.doneGuess()) {
      game.endRound();
      valueInfo = {
        'players': game.getPlayers(),
        'sids': game.getSids(),
        'names': game.getNames(),
        'scores': game.getScores()
      };
      console.log(valueInfo);
      io.sockets.emit('round-ended', valueInfo);
    }
    
  });
});