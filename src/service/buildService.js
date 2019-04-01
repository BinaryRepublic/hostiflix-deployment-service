const { exec } = require('child_process');

exports.submitToGoogleCloudBuildJob = (
    templateUrl,
    token,
    gitRepo,
    image,
    buildCode,
    startCode
) => {
    return new Promise((resolve, reject) => {
        const gCloudBuildCommand =
            `gcloud builds submit \\
            --config ${templateUrl}/cloudbuild.yml \\
            --substitutions _IMAGENAME="${image}",_STARTCODE="${startCode}",_TOKEN="${token}",_GIT="${gitRepo}",_BUILDCODE="${buildCode}" \\
            ${templateUrl}`;

        exec(gCloudBuildCommand, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};
