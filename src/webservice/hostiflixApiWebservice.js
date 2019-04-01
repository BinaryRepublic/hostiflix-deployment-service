const axios = require('axios');

const http = axios.create({
    baseURL: process.env.API_BASE_URL
});

exports.updateJobStatus = (jobId, status) => {
    console.log(`${jobId} - ${status}`);
    return http.put(`/jobs/${jobId}/status/${status}`);
};
