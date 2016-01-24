'use strict';


var app = require('../../../common/app');
var exerciseBuilder = require('../../../common/exerciseReadOnlyBuilder');

$(document).ready(function () {
    app = app();
    var exercises = window.exercises;
    var data = exerciseBuilder.buildExercisesWithData(exercises);
    $('#exerciseList').html(data);

    $('#reward-save-btn').click(function () {
        var self  = $(this);
        var comment = $('textarea[name="comment"]').val();
        var studentId = $('#studentId').val();
        var homeworkId = $('#homeworkId').val();
        var url = '/api/v1/homework/' + homeworkId + '/students/' + studentId + '/award';
        $.ajax({
            url: url,
            method: 'PUT',
            data: {comment: comment}
        }).then(function () {
            app.notify.success("批改成功");
            self.hide();

        });
    });

    $('#comment-options').change(function () {
        $('textarea[name="comment"]').append($(this).val()).append('\n');
    });
});
