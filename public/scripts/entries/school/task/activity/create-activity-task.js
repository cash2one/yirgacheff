'use strict';

require('select2/dist/css/select2.css');
require('select2');
require('../../../../common/formvalidator');
var app = require('../../../../common/app');
var richEditor = require('../../../../common/richEditor');
var datepicker = require('../../../../common/datetimepicker');

$(document).ready(function () {
    app();
    richEditor.render('content');
    datepicker.timeRange({
        start: 'startTime',
        end: 'endTime'
    });
    $(".enrolls").select2({
        tags: true
    });

    $("#activityForm").validate(function ($form, data) {

    });

});

