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
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(cookieParser());

app.use('/', indexRouter);

app.use('/user', userRouter);

//Starting Server Port
app.listen('5000', () => console.log('Server Running on Port:5000'));

module.exports = app;