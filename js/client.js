const socket = io('http://localhost:8000')

//get DOM elements in a respective js variables
const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('assets/iphone.mp3');
let isUserInteracted = false;

//function which will append even info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<div>
            <div class="message">${message}</div>
        </div>`
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}
document.addEventListener('click', () => {
    if (!isUserInteracted) {
        isUserInteracted = true;
    }
});
//if form gets submitted send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
});

const name = prompt("Enter your name to join: ");
socket.emit('new-user-joined', name);

//if new user joined receive his/her name from the server
socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right')
})
//if server sends message receive it
socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, 'left')
})
//if user leaves the chat append info to container
socket.on('left', name=>{
    append(`${name} left the chat`, 'left')
})