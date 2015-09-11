'use strict';

requirejs(['jquery', 'leftMenu', 'headMenu', 'audiojs', 'exerciseBuilder'],

    function ($, leftMenu, headMenu, audiojs, exerciseBuilder) {
        leftMenu.init();
        headMenu.init();
        var exercises = window.exercises;
        var data = exerciseBuilder.buildExercisesWithData(exercises);
        $('#exerciseList').html(data);
        audiojs.events.ready(function () {
            audiojs.createAll();
        });

    });
