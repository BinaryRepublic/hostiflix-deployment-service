'use strict';

// API boilerplate
const express = require('express');
const app = express();
const routes = require('./routes');

var bodyParser = require('body-parser');

// Logging
const morgan = require('morgan');
const logger = require('./logger');

// Config
const config = {
    port: process.env.PORT || 3000
};

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))

// Set up middleware for request parsing, logging, etc.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('short', { stream: logger.stream }));

// Load up the routes
app.use('/', routes);

// Start the API
app.listen(config.port);
logger.log('info', `api running on port ${config.port}`);

// Export API server for testing
module.exports = app;
