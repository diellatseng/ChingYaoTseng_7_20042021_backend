const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
// const path = require('path');

const app = express();

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')

// Loads environment variables from the .env file into process.env
require('dotenv').config();

// Enable all CORS requests
app.use(cors());

// Parsing incoming requests with JSON payloads by using the express embedded functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secure HTTP headers by using helmet
app.use(helmet());

// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;