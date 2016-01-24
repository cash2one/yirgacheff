'use strict';
var _ = require('underscore')
var app = require('../../common/app');


$(document).ready(function () {
    app();
    var rankCache = {};
    var rankList = $('#rankList');
    var classList = $('#classList');
    var rankTemplate = _.template($('#scoreRankTemplate').html());

    function renderRank(classId) {
        if (!classId || classId === '') {
            return;
        }
        if (rankCache[classId]) {
            rankList.html(rankTemplate({students: rankCache[classId]}));
        } else {
            $.get('/api/v1/classes/' + classId + '/students').then(function (data) {
                var students = _.sortBy(data, function (obj) {
                    return 0 - obj.score;
                });
                rankCache[classId] = students;
                rankList.html(rankTemplate({students: students}));

            });
        }
    }

    renderRank(classList.val());
    classList.change(function () {
        renderRank($(this).val());
    });

});
