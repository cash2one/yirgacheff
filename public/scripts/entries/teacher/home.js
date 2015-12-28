'use strict';

requirejs(['jquery', 'restfulClient', 'infoBox', 'headMenu', 'leftMenu', 'underscore', 'easyDropDown'],
    function ($, $http, infobox, headMenu, leftMenu, _) {
        headMenu.init();
        leftMenu.init();
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
