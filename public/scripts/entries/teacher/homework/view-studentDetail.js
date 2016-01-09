'use strict';

require('datatables');
require('highcharts');

var app = require('../../../common/app');
var exerciseBuilder = require('../../../common/exerciseReadOnlyBuilder');

$(document).ready(function () {
    var exercises = window.exercises;
    var data = exerciseBuilder.buildExercisesWithData(exercises);
    $('#exerciseList').html(data);

    $('#reward-save-btn').click(function () {
        var comment = $('textarea[name="comment"]').val();
        var studentId = $('#studentId').val();
        var homeworkId = $('#homeworkId').val();

        if (comment === '') {
            layer.msg('请填写评语');
            return;
        }
        var url = '/api/v1/homework/' + homeworkId + '/students/' + studentId + '/award';
        $http.put(url, {comment: comment}, function () {
            self.location.href = '';
        });
    });

    setTimeout(function () {
        $('.dropdown').css({"width": '473px'});
    }, 500);

    $('#comment-options').change(function () {
        $('textarea[name="comment"]').append($(this).val()).append('\n');
    });
});
