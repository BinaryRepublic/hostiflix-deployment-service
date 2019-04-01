'use strict';

const router = require('express').Router();
const errors = require('./errors');
const jobRouter = require('./controller/jobController').getJobRouter();

// Wire up routers
router.use('/jobs', jobRouter);

// Wire up error-handling middleware
router.use(errors.errorHandler);
router.use(errors.nullRoute);

// Export the router
module.exports = router;
