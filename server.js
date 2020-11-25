const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users.js'); 

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects - An open door between client and server
const botName = 'ChatCord Bot';

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome current user!
        socket.emit('message', formatMessage(botName , 'Welcome to ChatCord!'));
        
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName , `${user.username} joined the chat`)); 

        // Send user and room information
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Broadcast when a user disconnects
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName , `${user.username} has left the chat`));

            // Send user and room information
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
    
    // socket.broadcast.emit() Transmits to All except Client
    // socket.emit(), Transmits to Client
    // io.emit(), Transmits to All including Client
})
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});