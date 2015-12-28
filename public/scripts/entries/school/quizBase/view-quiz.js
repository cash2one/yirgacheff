'use strict';
var app = require('../../../common/app');
var exerciseBuilder = require('../../../common/exerciseReadOnlyBuilder');

$(document).ready(function () {
    app();
    var exercises = window.exercises;
    if (exercises) {
        var result = exerciseBuilder.buildExercisesWithData(exercises);
        $('#questions-area').html(result);
    }
});
