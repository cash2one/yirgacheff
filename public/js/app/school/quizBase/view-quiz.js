'use strict';


requirejs(['jquery', 'leftMenu', 'headMenu', 'exerciseReadOnlyBuilder'],
    function ($, leftMenu, headMenu, exerciseReadOnlyBuilder) {

        leftMenu.init();
        headMenu.init();
        var exercises = window.exercises;
        if (exercises) {
            var result = exerciseReadOnlyBuilder.buildExercisesWithData(exercises);
            $('#questions-area').html(result);
        }
    });
