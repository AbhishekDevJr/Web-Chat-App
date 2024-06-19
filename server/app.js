const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const indexRouter = require('./Routes/indexRouter');
const userRouter = require('./Routes/userRouter');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const app = express();

const http = require('http').createServer(app);
const io = new Server(http, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your React app's URL
        methods: ['GET', 'POST'],
    },
});

console.log('Server Running------------->');

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const generateRoomId = (userId1, userId2) => {
        // Example: combine user IDs in alphabetical order to avoid duplicates
        const [id1, id2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
        return `${id1}_${id2}`;
    };

    // Handle user joining a chat room
    socket.on('joinRoom', (roomId) => {
        // Check if the room already exists
        socket.join(roomId); // User joins the room
        console.log('User', socket.id, 'joined room', roomId);
    });

    socket.on('typing', ({ roomId, currUserData }) => {
        console.log('Server Typing--------->', roomId, currUserData);
        socket.to(roomId).emit('typing', { currUserData });
    });

    socket.on('stopTyping', ({ roomId, currUserData }) => {
        console.log('Server Typing Stop--------->', currUserData);
        socket.to(roomId).emit('stopTyping', { currUserData });
    });

    // Handle sending messages
    socket.on('sendMessage', (messageData) => {
        console.log('Received message:', messageData);
        const roomId = generateRoomId(messageData?.roomId); // Use generateRoomId here
        io.to(messageData?.roomId).emit('receiveMessage', messageData);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
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
    credentials: true,
}));

app.use(cookieParser());

app.use('/', indexRouter);

app.use('/user', userRouter);

//Starting Server Port
// app.listen('5000', () => console.log('Server Running on Port:5000'));
http.listen('5000', () => console.log('Server Running on Port:5000'));

module.exports = app;