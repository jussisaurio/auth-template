// Main starting point of application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Logging framework for requests
const mongoose = require('mongoose');

const app = express(); // create instance of Express
const router = require('./router');

// DB Setup
mongoose.connect('mongodb://localhost:auth/kayttajat'); // creates new mongo database called kayttajat

// App setup (middleware)
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

// Server setup
const port = process.env.PORT || 3090; // if environment port defined, use that, else 3090
const server = http.createServer(app); // forwards any HTTP requests to app (express)
server.listen(port);
console.log ('Server listening on:', port);

// browsers try to GET '/' by default.
