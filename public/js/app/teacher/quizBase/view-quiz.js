'use strict';

requirejs(['jquery', 'leftMenu', 'headMenu', 'exerciseBuilder'],
    function ($, leftMenu, headMenu, exerciseBuilder) {
        leftMenu.init();
        headMenu.init();
        var exercises = window.exercises;
        if (exercises) {
            var result = exerciseBuilder.buildExercisesWithData(exercises);
            $('#questions-area').html(result);
        }
    });
