const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const {PrismaClient} = require('@prisma/client')
// const path = require('path');

const prisma = new PrismaClient()
const app = express();

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')

require('dotenv').config();                                     // Loads environment variables from the .env file into process.env

app.use(cors());                                                // Enable all CORS requests
app.use(helmet());                                              // Secure HTTP headers by using helmet

app.use(express.json());                                        // Parsing incoming requests with JSON payloads by using the express embedded functions
app.use(express.urlencoded({ extended: true }));

app.get('/', async(req, res, next) => {
    res.send({ message: 'Server is now running.'});
})

// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;