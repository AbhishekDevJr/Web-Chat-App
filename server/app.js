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
const httpModule = require('http');
const ws = require('ws');

const app = express();

const http = require('http').createServer(app);
const io = new Server(http, {
    cors: {
        origin: process.env.ORIGIN, // Replace with your React app's URL
        methods: ['GET', 'POST'],
    },
    wsEngine: ws.Server
});

io.on('connection', (socket) => {

    const generateRoomId = (userId1, userId2) => {
        // Example: combine user IDs in alphabetical order to avoid duplicates
        const [id1, id2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
        return `${id1}_${id2}`;
    };

    // Handle user joining a chat room
    socket.on('joinRoom', (roomId) => {
        // Check if the room already exists
        socket.join(roomId); // User joins the room
    });

    socket.on('typing', ({ roomId, currUserData }) => {
        socket.to(roomId).emit('typing', { currUserData });
    });

    socket.on('stopTyping', ({ roomId, currUserData }) => {
        socket.to(roomId).emit('stopTyping', { currUserData });
    });

    // Handle sending messages
    socket.on('sendMessage', (messageData) => {
        const roomId = generateRoomId(messageData?.roomId); // Use generateRoomId here
        io.to(messageData?.roomId).emit('receiveMessage', messageData);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpModule.get('http://ifconfig.me/ip', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        console.log(`Outbound IP Address: ${data}`);
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

//Connecting to MongoDB Using Mongoose ODM
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
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
    origin: process.env.ORIGIN,
    credentials: true,
}));

app.use(cookieParser());

app.use('/', indexRouter);

app.use('/user', userRouter);

//Starting Server Port
http.listen(process.env.PORT || '5000', () => console.log('Server Running on Port:5000'));

module.exports = app;