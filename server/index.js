// server/index.js

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const CHAT_BOT = 'ChatBot';
require('dotenv').config({ path: '../.env'});

let chatRoom = '';
let allUsers = [];

app.use(cors()); // Add cors middleware

const server = http.createServer(app);
const harperSaveMessage = require('./services/harper-save-message');
const harperGetMessages = require('./services/harper-get-messages');
const leaveRoom = require('./utils/leave_room');


// Add socket.io
const io = new Server(server, {
    cors: {
        //allow cross-origin requests from the client
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['from-websocket-with-love'],
    },
});

// Add socket.io event listener
io.on('connection', (socket) => {
    console.log(`a user connected -> ${socket.id}`);


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


        // Get all messages in the room on user join
        harperGetMessages(room)
            .then((last100Messages) => {
                socket.emit('last_100_messages',last100Messages);
            })
            .catch((err) => console.log(err));

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
    });

    // User leave room
    socket.on('leave_room', (data) => {
        const { username, room } = data;
        // Use to broadcast to all users in the room(a message event) that a user has left.
        // socket.to(room).emit('message', `${username} has left the room`);
        // Get current time stamp.
        let __createdtime__ = new Date().toLocaleTimeString();

        allUsers = leaveRoom(socket.id, allUsers);
        // Use to broadcast to all users in the room(a receive_message event) that a user has left.
        socket.to(room).emit('chatroom_users',allUsers);
        socket.to(room).emit('receive_message',{
            message: `${username} has left the room`,
            username: CHAT_BOT,
            createdtime: __createdtime__,
        });
        console.log(`${username} has left the room`);
    });

    // User disconnect
    socket.on('disconnect', () => {
        console.log(`a user disconnected ${socket.id}`);
        const user = allUsers.find((user) => user.id == socket.id);
        if (user?.username){
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(chatRoom).emit('chatroom_users',allUsers);
            socket.to(chatRoom).emit('receive_message',{
                message: `${user.username} has left the room`,
                username: CHAT_BOT,
                createdtime: __createdtime__,
            });
        }
    });

});

app.get('/', (req, res) => {
    res.send('This is the server side page, please go port 3000.');
});
  

// server.listen(4000, () => 'Server is running on port 4000');
//server listen 0.0.0.0 4000port
server.listen(process.env.PORT || 4000, '0.0.0.0', () => 'Server is running on port 4000');


// npm run dev