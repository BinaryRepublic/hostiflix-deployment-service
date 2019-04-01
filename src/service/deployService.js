const { exec } = require('child_process');
const fs = require('fs');

exports.deployToKubernetes = (image, deploymentId, port, subDomain) => {
    const { deployment, service, ingress } = getKubernetesManifests(image, deploymentId, port, subDomain);

    const manifests = `${deployment}\n---\n${service}\n---\n${ingress}`;
    const kubectlApplyManifests = `echo -n '${manifests}' | kubectl apply -f -`;

    return new Promise((resolve, reject) => {
        exec(kubectlApplyManifests, (err, stdout) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(stdout); // TODO: remove this
            resolve();
        })
    });
};

const getKubernetesManifests = (image, deploymentId, port, subDomain) => {
    const fullImage = `gcr.io/project-cloud-231013/${image}`;
    const deploymentTemplate = fs.readFileSync('templates/k8s-deployment.yml', 'utf8');
    const deployment = replaceUsingArray(deploymentTemplate, [
        { s: '{deploymentId}', r: deploymentId },
        { s: '{image}', r: fullImage }
    ]);
    const serviceTemplate = fs.readFileSync('templates/k8s-service.yml', 'utf8');
    const service = replaceUsingArray(serviceTemplate, [
        { s: '{deploymentId}', r: deploymentId },
        { s: '{port}', r: port }
    ]);
    const ingressTemplate = fs.readFileSync('templates/k8s-ingress.yml', 'utf8');
    const ingress = replaceUsingArray(ingressTemplate, [
        { s: '{deploymentId}', r: deploymentId },
        { s: '{subDomain}', r: subDomain }
    ]);

    return { deployment, service, ingress };
};

const replaceUsingArray = (string, replacements) => {
    replacements.forEach(replacement => {
        string = string.replace(new RegExp(replacement.s, 'g'), replacement.r);
    });
    return string;
};
