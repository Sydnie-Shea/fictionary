const socket = io('http://localhost:3000');


const messageContainer = document.getElementById('message-container');
const startButton = document.getElementById('start');
const newWordButton = document.getElementById('newWord');
const acceptButton = document.getElementById('accept');
const defWriting = document.getElementById('fakeDefinition');
const sendButton = document.getElementById('send-button');
const guessTimeButton = document.getElementById('guessTime');
const nameEntry = document.getElementById('name');
const joinButton = document.getElementById('join');
const guessNum = document.getElementById('guessNum');
const guessSubmit = document.getElementById('guess');
const fakeDefForm = document.getElementById('send-container');

newWordButton.style.display="none";
acceptButton.style.display="none";
defWriting.style.display="none";
sendButton.style.display="none";
guessTimeButton.style.display="none";
startButton.style.display="none";

function getName(){
    // const name = prompt('What is your name?');
    const name = nameEntry.value;
    nameEntry.style.display="none";
    joinButton.style.display="none";
    startButton.style.display="block";
    appendMessage('You joined');
    socket.emit('new-user', name);  
}
guessNum.style.display="none";
guessSubmit.style.display="none";



socket.on('user-disconnected', name => {
    appendMessage(`${name} quit`);
});

socket.on('user-connected', name => {
    appendMessage(`${name} joined`);
});

socket.on('round-started', gameInfo => {
    console.log("round starting client side");
    startButton.style.display = "none";
    if (gameInfo["holder"] == socket.id) {
        appendMessage(gameInfo["word"]["word"]);
        appendMessage(gameInfo["word"]["definition"]);
        newWordButton.style.display = "block";
        acceptButton.style.display = "block";
    }
});

socket.on('new-word-given', word => {
    appendMessage(word["word"]);
    appendMessage(word["definition"]);
});

socket.on('show-word', word => {
    appendMessage(`${word} is the word for this round. Write a definition`)
    defWriting.style.display = "block";
    sendButton.style.display = "block";
});

socket.on('fake-def-received', defInfo => {
    console.log("getting here");
    console.log(defInfo);
    if (defInfo['holder'] == socket.id) {
        appendMessage(`${defInfo['playerName']} submitted ${defInfo['def']}`);
    }
});

socket.on('fake-def', turnInfo => {
    if (socket.id != turnInfo["holdersid"]) {
        guessNum.style.display = "block";
        guessSubmit.style.display = "block";
    }
    for (word in turnInfo["defs"]) {
        appendMessage(turnInfo["defs"][word]);
    }
});

socket.on('round-ended', valueInfo => {
    var names = valueInfo['names'];
    var scores = valueInfo['scores'];
    console.log(scores);
    for (i = 0; i< names.length; i++) {
        appendMessage(`${names[i]} has a score of ${scores[i]}`);
    }
    if (socket.id == valueInfo['sids'][0]){
        socket.emit('started');
    }
});

startButton.addEventListener('click', button => {
    socket.emit('started');
});

newWordButton.addEventListener('click', button => {
    socket.emit('new-word');
});

acceptButton.addEventListener('click', button => {
    socket.emit("word-selected");
    newWordButton.style.display = "none";
    acceptButton.style.display = "none";
    guessTimeButton.style.display="block";
});

sendButton.addEventListener('click', button => {
    // button.preventDefault();
    var def = defWriting.value;
    console.log('button clicked')
    defWriting.value = "";
    defWriting.style.display = "none";
    sendButton.style.display = "none";
    socket.emit('submit-fake-def', def);
});

guessTimeButton.addEventListener('click', button => {
    button.preventDefault();
    guessTimeButton.style.display = "none";
    socket.emit('show-fake-def');
})

guessSubmit.addEventListener('click', button => {
    button.preventDefault();
    var guess = parseInt(guessNum.value) - 1;
    guessNum.value = "";
    guessNum.style.display = "none";
    guessSubmit.style.display = "none";
    socket.emit("guessing", guess);
})

fakeDefForm.addEventListener('submit', () => {
    sendButton.click();
})

function appendMessage(message) {
    console.log(message);
    const messageElement = document.createElement('div')
    messageElement.setAttribute('class', 'appended')
    messageElement.innerText = message
    messageContainer.append(messageElement)
  }