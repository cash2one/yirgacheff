'use strict';

var app = require('../../common/app');
var $http = require('../../common/restfulClient');
var _ = require('underscore');


$(document).ready(function () {
    app();
    var rankCache = {},
        rankList = $('#rankList'),
        classList = $('#class-list'),
        rankTemplate = _.template($('#scoreRankTemplate').html());

    function renderRank(classId) {
        if (!classId || classId === '') {
            return;
        }
        if (rankCache[classId]) {
            rankList.html(rankTemplate({students: rankCache[classId]}));
        } else {
            $http.get('/api/v1/classes/' + classId + '/students', function (data) {
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
