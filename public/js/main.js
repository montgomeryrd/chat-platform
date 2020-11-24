const chatForm = document.getElementById('chat-form');
const socket = io();

// Message from server
socket.on('message', message => {
    console.log(message)
    outputMessage(message);
})

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Riker <span> 9:32am</span></p><p class="text">${message}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}