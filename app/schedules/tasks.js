'use strict';
var kue = require('kue'),
    mongoose = require('mongoose'),
    states = require('../common/constants').states,
    jobs = kue.createQueue();

jobs.on('job complete', function (id) {
    kue.Job.get(id, function (err, job) {
        if (err) return;
        job.remove(function (err) {
            if (err) throw err;
        });
    });
});

exports.createJob = function (jobId, data) {
    jobs.create(jobId, data).attempts(5).save(function (err) {
        if (err) {
        }
    });
};

