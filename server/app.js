const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const indexRouter = require('./Routes/indexRouter');
const userRouter = require('./Routes/userRouter');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: `http://localhost:3000`,
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining a chat room
    socket.on('joinRoom', (roomId) => {
        // Check if the room already exists
        if (!io.sockets.adapter.rooms.has(roomId)) {
            console.log('Creating room:', roomId);
            socket.join(roomId); // User joins the newly created room
        } else {
            socket.join(roomId); // User joins an existing room
        }
    });

    // Handle sending messages
    socket.on('sendMessage', (messageData) => {
        console.log('Received message:', messageData);

        // Broadcast the message to all users in the room
        io.to(messageData.roomId).emit('receiveMessage', messageData);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Broadcast a notification that a user has left
        io.emit('userLeft', { userId: socket.id });
    });
});


// io.on('connection', (socket) => {
//     socket.on("login", ({ name, room }, callback) => {

//     })
//     socket.on("sendMessage", message => {

//     })
//     socket.on("disconnect", () => {

//     })
// })

//Connecting to MongoDB Using Mongoose ODM
mongoose.connect('mongodb+srv://abhishek007coc:MirXHuz64DLzI8kb@cluster0.lpnqwnl.mongodb.net/ExclusiveMessenger', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsInsecure: true,
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB Connection Error---->', err);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('MongoDB Connected Successfully!');
});

//MiddleWares for BodyRequest Parsing, CORS
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(cookieParser());

app.use('/', indexRouter);

app.use('/user', userRouter);

//Starting Server Port
app.listen('5000', () => console.log('Server Running on Port:5000'));

module.exports = app;