'use strict';
var util = require('util')
var exec = require('child_process').exec
var randomstring = require("randomstring")

exports.status = (req, res, next) => {
    var random = randomstring.generate({
        length: 8,
        charset: 'alphabetic',
        capitalization: 'lowercase'
    })
    var containerName = "hostiflix-" + random
    var dir = exec('gcloud builds submit --config cloudbuild.yaml --substitutions _IMAGENAME="'+containerName+'",_STARTCODE="'+req.body.startCode+'",_TOKEN="'+req.body.token+'",_GIT="' + req.body.git + '",_BUILDCODE="'+req.body.buildCode+'" .', (err, stdout, stderr) => {
        if (err) {
            console.log('#erroroutput', err)
        }
        console.log('#output', stdout);
        console.log('################ KUBCTL DEPLOY ################')
        var deploy = exec('kubectl run "'+containerName+'" --image=gcr.io/project-cloud-231013/'+containerName+':latest --port 3000', (err, stdout, stderr) => {
            if (err) {
                console.log('#erroroutput', err)
            }
            console.log('deployed', stdout);
        })
    })
    /*var dir = exec('docker run --rm --name ' + containerName + ' -e cname="' + containerName + '" -e git="' + req.body.git + '" -e token="'+req.body.token+'" -e buildCode="'+req.body.buildCode+'" -e startCode="'+req.body.startCode+'" -v $(PWD)/build.sh:/build.sh --env-file settings hostidock "/build.sh"', (err, stdout, stderr) => {
        if (err) {
            console.log(err)
        }
        console.log(stdout);
    })*/
    res.status(200).json({ status: 'success', containerId: containerName });
};
