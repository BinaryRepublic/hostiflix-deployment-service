'use strict';

// Router
const router = require('express').Router();
const build = require('./index');

// Health
router.post('/', build.status);

// Export the router
module.exports = router;