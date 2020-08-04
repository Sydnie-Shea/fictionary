const socket = io('http://localhost:3000')

//elments from the html file
const messageContainer = document.getElementById('message-container')

const name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user', name);


socket.on('user-disconnected', name => {
    appendMessage(`${name} quit`);
  })  

  socket.on('user-connected', name => {
      console.log("I know someone joined");
      appendMessage(`${name} joined`);
  })


function appendMessage(message) {
    console.log(message);
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
  }