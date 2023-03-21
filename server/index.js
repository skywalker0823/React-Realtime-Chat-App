// server/index.js

require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const CHAT_BOT = 'ChatBot';


let chatRoom = '';
let allUsers = [];

app.use(cors()); // Add cors middleware

const server = http.createServer(app);
const harperSaveMessage = require('./services/harper-save-message');


// Add socket.io
const io = new Server(server, {
    cors: {
        //allow cross-origin requests from the client
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Add socket.io event listener
io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);


    // Block 1 :Listen to the message event from the client
    socket.on('joinRoom', (data) => {
        const { username, room } = data;// Get username and room from data
        socket.join(room);// Put the user in the room
        // Use to broadcast to all users in the room(a message event) that a new user has joined.
        // socket.to(room).emit('message', `${username} has joined the room`);
        // Get current time stamp.
        let __createdtime__ = new Date().toLocaleTimeString();
        // Use to broadcast to all users in the room(a receive_message event) that a new user has joined.
        socket.to(room).emit('receive_message',{
            message: `${username} has joined the room`,
            username: CHAT_BOT,
            createdtime: __createdtime__,
        });

        // Send a message to the user who just joined the room.
        socket.emit('receive_message',{
            message: `Welcome to the room ${username}`,
            username: CHAT_BOT,
            createdtime: __createdtime__,

        });
        chatRoom = room;
        // Add the new user to the allUsers array
        allUsers.push({ id: socket.id, username, chatRoom });
        // Get all users in the same room
        chatRoomUsers = allUsers.filter((user) => user.room === chatRoom);
        // Send the chatRoomUsers to the client
        socket.to(chatRoom).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);

    });


    // User send message
    socket.on('send_message', (data) => {
        const { username, room, message, createdtime } = data;
        // Send message to the server
        io.in(room).emit('receive_message', data);// Send to all users in the room, including the sender.
        // Also save the message to the database
        harperSaveMessage(message, room ,username, createdtime)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    );

});

app.get('/', (req, res) => {
    res.send('This is the server side page, please go port 3000.');
  });
  

server.listen(4000, () => 'Server is running on port 4000');

// npm run dev