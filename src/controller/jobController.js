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
        projectId,
        projectHash,
        gitRepo,
        gitBranch
    } = req.body;

    const template = 'nodejs';
    const templateUrl = `templates/${template}`;
    const jobId = uuidv4();
    const normalizedBranch = gitBranch.replace(/[^a-zA-Z0-9]/g, '-');
    const shortProjectId = projectId.split('-')[0];
    const image = `${template}-${shortProjectId}-${normalizedBranch}:${jobId}`;
    const subDomain = `${normalizedBranch}-${projectHash}`;

    submitToGoogleCloudBuildJob(
        templateUrl,
        token,
        gitRepo,
        image,
        buildCode,
        startCode
    ).then(() => {
        updateJobStatus(jobId, DEPLOYMENT_PENDING);
        const deploymentId = `${normalizedBranch}-${shortProjectId}`;
        const port = 3000; // TODO: automatic port detection

        deployToKubernetes(image, deploymentId, port, subDomain).then(() => {
            updateJobStatus(jobId, DEPLOYMENT_SUCCESSFUL);
        }).catch(err => {
            updateJobStatus(jobId, DEPLOYMENT_FAILED);
            logError(err);
        })
    }).catch(err => {
        updateJobStatus(jobId, BUILD_FAILED);
        logError(err);
    });

    res.status(202).json({
        job: {
            status: BUILD_SCHEDULED,
            id: jobId,
            image,
            subDomain
        }
    });
};

const logError = err => {
    console.error('#erroroutput', err);
};
