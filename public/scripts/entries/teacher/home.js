'use strict';

var app = require('../../common/app');
var _ = require('underscore');


$(document).ready(function () {
    app();
    var rankCache = {};
    var rankList = $('#rankList');
    var classList = $('#class-list');
    var rankTemplate = _.template($('#scoreRankTemplate').html());

    function renderRank(classId) {
        if (!classId || classId === '') {
            return;
        }
        console.log('rank...');
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
