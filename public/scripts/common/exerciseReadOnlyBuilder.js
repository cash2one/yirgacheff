var _ = require('underscore');

var templates = {};

function buildUpTextSel(optionCount, exercise) {
    exercise = exercise || {};
    var template = templates.textSelectTemplate;
    if (!template) {
        template = _.template($("#textSelectTemplate").html());
        templates.textSelectTemplate = template;
    }
    return template({optionCount: optionCount, exercise: exercise});
}

//图片选择题[出题]
function buildUpImageSel(optionCount, exercise) {
    exercise = exercise || {};
    var template = templates.imageSelectTemplate;
    if (!template) {
        template = _.template($("#imageSelectTemplate").html());
        templates.imageSelectTemplate = template;
    }
    return template({optionCount: optionCount, exercise: exercise});
}


//填空[出题]
function buildUpFillBlanks(exercise) {
    exercise = exercise || {};
    var template = templates.blankTemplate;
    if (!template) {
        template = _.template($("#blankTemplate").html());
        templates.blankTemplate = template;
    }
    return template({exercise: exercise});
}


function buildVoiceQuestions(exercise) {
    exercise = exercise || {};
    var template = templates.voiceTemplate;
    if (!template) {
        template = _.template($("#voiceTemplate").html());
        templates.voiceTemplate = template;
    }
    return template({exercise: exercise});
}


var buildExercisesWithData = function (exercises) {
    exercises = exercises || [];
    var result = '';
    for (var i = 0; i < exercises.length; i++) {
        var exercise = exercises[i];
        var eType = parseInt(exercise.eType);
        switch (eType) {
            case 0:        //文字选择题
                result += buildUpTextSel(exercise.choices.length, exercise);
                break;
            case 1:        //图片选择题
                result += buildUpImageSel(exercise.choices.length, exercise);
                break;
            case 2:        //填空题
                result += buildUpFillBlanks(exercise);
                break;
            case 3:        //语音题
                result += buildVoiceQuestions(exercise);
                break;
        }
    }
    return result;
};

module.exports.buildExercisesWithData = buildExercisesWithData;



