const socket = io('http://localhost:3000');


const messageContainer = document.getElementById('message-container');
const startButton = document.getElementById('start');
const newWordButton = document.getElementById('newWord');
const acceptButton = document.getElementById('accept');
const defWriting = document.getElementById('fakeDefinition');
const sendButton = document.getElementById('send-button');
const guessTimeButton = document.getElementById('guessTime');

newWordButton.style.display="none";
acceptButton.style.display="none";
defWriting.style.display="none";
sendButton.style.display="none";
guessTimeButton.style.display="none";

const name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user', name);


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
})

socket.on('fake-def-received', defInfo => {
    console.log("getting here");
    console.log(defInfo);
    if (defInfo['holder'] == socket.id) {
        appendMessage(`${defInfo['playerName']} submitted ${defInfo['def']}`);
    }
})

startButton.addEventListener('click', button => {
    socket.emit('started', name);
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
    button.preventDefault()
    var def = defWriting.value;
    defWriting.value = "";
    defWriting.style.display = "none";
    sendButton.style.display = "none";
    socket.emit('submit-fake-def', def);
});

function appendMessage(message) {
    console.log(message);
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
  }