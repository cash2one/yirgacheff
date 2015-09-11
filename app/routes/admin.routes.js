var express = require('express'),
    schools = require('../api/v1/schools.api');

module.exports = function (app) {
    var admin = express.Router();
    admin.post('/schools', schools.create);
    app.use('/admin', admin);
    console.log('admin router load !');
};