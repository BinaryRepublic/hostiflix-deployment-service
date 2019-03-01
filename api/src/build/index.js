'use strict';
var util = require('util')
var exec = require('child_process').exec
var randomstring = require("randomstring")


exports.status = (req, res, next) => {
    var random = randomstring.generate({
        length: 8,
        charset: 'alphabetic'
    })
    var containerName = "hostiflix-" + random
    //add parameter validation

    var dir = exec('docker run --rm --name ' + containerName + ' -e git="' + req.body.git + '" token="'+req.body.token+'" -v $(PWD)/code/nodeJS.sh:/code.sh -v $(PWD)/build.sh:/build.sh --env-file settings hostidock "/build.sh"', (err, stdout, stderr) => {
        if (err) {
            // should have err.code here?
            console.log(err)
        }
        console.log(stdout);
    })
    res.status(200).json({ status: 'success', containerId: containerName });
};
