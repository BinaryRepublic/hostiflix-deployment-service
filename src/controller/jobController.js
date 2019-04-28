'use strict';

const uuidv4 = require('uuid/v4');
const { submitToGoogleCloudBuildJob } = require('../service/buildService');
const { deployToKubernetes } = require('../service/deployService');
const { updateJobStatus } = require('../webservice/hostiflixApiWebservice');
const {
    BUILD_SCHEDULED,
    BUILD_FAILED,
    DEPLOYMENT_PENDING,
    DEPLOYMENT_SUCCESSFUL,
    DEPLOYMENT_FAILED
} = require('../model/jobStatus');

exports.getJobRouter = () => {
    const router = require('express').Router();
    router.post('/submit', runBuildAndDeployJob);
    return router;
};

const runBuildAndDeployJob = (req, res, next) => {
    const {
        startCode,
        buildCode,
        token,
        subDomain,
        gitRepo,
        branch
    } = req.body;

    const template = 'nodejs';
    const templateUrl = `templates/${template}`;
    const jobId = uuidv4();
    const image = `${template}-${subDomain}:${jobId}`;

    submitToGoogleCloudBuildJob(
        templateUrl,
        token,
        gitRepo,
        branch,
        image,
        buildCode,
        startCode
    ).then(() => {
        updateJobStatus(jobId, DEPLOYMENT_PENDING);
        const deploymentId = subDomain.replace(/\./g, "-");
        const port = 3000; // TODO: automatic port detection

        deployToKubernetes(image, deploymentId, port, subDomain).then(() => {
            setTimeout(() => {
                updateJobStatus(jobId, DEPLOYMENT_SUCCESSFUL);
            }, 20000);
        }).catch(err => {
            updateJobStatus(jobId, DEPLOYMENT_FAILED);
            logError(err);
        })
    }).catch(err => {
        updateJobStatus(jobId, BUILD_FAILED);
        logError(err);
    });

    res.status(202).json({
        status: BUILD_SCHEDULED,
        id: jobId
    });
};

const logError = err => {
    console.error('#erroroutput', err);
};
