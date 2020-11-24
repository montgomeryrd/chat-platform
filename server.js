const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects - An open door between client and server
io.on('connection', socket => {
    // Welcome current user!
    socket.emit('message', 'Welcome to ChatCord!'); // Transmits to Client

    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat'); 

    // Broadcast when a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });
    // socket.broadcast.emit() Transmits to All except Client
    // socket.emit(), Transmits to Client
    // io.emit(), Transmits to All including Client
})
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});