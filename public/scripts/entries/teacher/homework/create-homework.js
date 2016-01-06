'use strict';

var app = require('../../../common/app');
var upload = require('../../../common/uploadifive');
var _ = require('underscore');
var Quiz = require('../../../components/exercise');


$(document).ready(function () {
    app = app();
    //var exerciseTemplate = _.template($('#exerciseTemplate').html());
    //var optionTemplate = _.template($('#optionTemplate').html());
    //var $exerciseList = $('#exerciseList');

    var vm = new Vue({
        el: '#exerciseList',
        data: {quizzes: []},
        methods: {
            delete: function (index) {
                this.quizzes.splice(index, 1);
            }
        }
    });

    //var exercises = window.exercises;
    //if (exercises) {
    //    $('#exerciseList-area').html(exerciseBuilder.buildExercisesWithData(exercises));
    //}
    //班级选择
    var classes = $('#level_and_clazzs').find('ul li');

    classes.bind('click', function () {
        var clazz = 'active';
        var mark = $(this).hasClass(clazz);
        if (mark) {
            $(this).removeClass(clazz);
        } else {
            $(this).addClass(clazz);
        }
    });

    function refreshCount() {
        var $qustNum = $('.quest-number');
        for (var i = 0; i < $qustNum.length; i++) {
            $qustNum.eq(i).text(i + 1);
        }
    }

    ////隐藏题目
    //$exerciseList.on('click', '.panel-collapse', function () {
    //    $(this).closest(".panel").children('.panel-body').slideToggle('fast');
    //
    //});
    ////删除题目
    //$exerciseList.on('click', '.panel-remove', function () {
    //    $(this).closest('.panel').remove();
    //    refreshCount();
    //});

    //添加题目
    $('.btn-add-exercise').click(function () {
        var eType = parseInt($(this).attr('data-type'));
        vm.$data.quizzes.push({eType: eType});
    });
    ////添加选项
    //$exerciseList.on('click', '.addoption', function () {
    //    var inputCount = $(this).closest('.row').children('.new-option').length;
    //    if (inputCount > 1) {
    //        app.notify.warning("只能4个选项哦");
    //        return;
    //    }
    //    var optionNum = 'C';
    //    if (inputCount === 1) {
    //        optionNum = 'D'
    //    }
    //    var option = optionTemplate({type: $(this).attr('data-type'), option: optionNum});
    //    $(this).parent().before(option);
    //    $(this).closest('.quiz-item').find('.dropdown-menu').append('<li class="new-li">' + '<a class="drop-option answer">' + optionNum + '</a>' + '</li>');
    //});
    ////删除选项
    //$exerciseList.on('click', '.del-option', function () {
    //    $(this).closest('form').find('.dropdown-toggle').text('选择答案');
    //    $(this).closest('form').find('.option-title').html('C');
    //    $(this).closest('form').find('.drop-option').text('C');
    //    $(this).closest('form').find('.new-li').eq(0).remove();
    //    $(this).closest('.new-option').remove();
    //});
    ////选择答案
    //$exerciseList.on('click', '.answer', function () {
    //    var answer = $(this).closest('li').find('.answer').text();
    //    $(this).closest('.input-group-btn').find('.dropdown-toggle').text(answer);
    //});
    //
    //
    ////作业信息的校验
    //function getAssignInfo() {
    //    var classes = $('.t-homeworkClass-list').find('ul>li.active');
    //    var title = $('#homework-title').val();
    //    var keyPoint = $('#keyPoint').val().trim();
    //    var keyPointRecord = $('#keyPointRecord').val();
    //    var finishAward = $('#finishAward').val();
    //    var performanceAward = $('#performanceAward').val();
    //    var addQuizBase = $('#addQuizBase').val();
    //    var classIds = [];
    //    classes.each(function () {
    //        classIds.push($(this).attr('id'));
    //    });
    //    var assignInfo = {
    //        title: title,
    //        keyPoint: keyPoint,
    //        classIds: classIds,
    //        finishAward: finishAward,
    //        performanceAward: performanceAward
    //    };
    //    if (addQuizBase === '1') {
    //        assignInfo.addQuizBase = true;
    //    }
    //    if (keyPointRecord && keyPointRecord !== "") {
    //        assignInfo.keyPointRecord = keyPointRecord;
    //    }
    //    return assignInfo;
    //}
    //
    ////获取作业信息
    //function gtHomeworkData() {
    //    var assignInfo = getAssignInfo();
    //    if (assignInfo.classIds.length === 0) {
    //        notify.danger('请选择要布置作业的班级！');
    //        return false;
    //    }
    //    if (assignInfo.title === '') {
    //        notify.danger('请填写作业标题！');
    //        return false;
    //    }
    //    if (!validator.isInt(assignInfo.finishAward, {min: 0, max: 9999})) {
    //        notify.danger('完成奖励分数必须为0-9999的数字');
    //        return false;
    //    }
    //    if (!validator.isInt(assignInfo.performanceAward, {min: 0, max: 9999})) {
    //        notify.danger('成绩奖励分数必须为0-9999的数字');
    //        return false;
    //    }
    //    var exercises = [];
    //    $('#exerciseList-area')
    //        .find('.buildUp')
    //        .each(function () {
    //            exercises.push(exerciseBuilder.makeExerciseObject($(this)));
    //        });
    //    var message = null;
    //    for (var i = 0; i < exercises.length; i++) {
    //        var res = exerciseBuilder.validateExerciseObject(exercises[i]);
    //        if (!res.valid) {
    //            message = res.message;
    //            break;
    //        }
    //    }
    //    if (message) {
    //        notify.danger(message);
    //        return false;
    //    }
    //    assignInfo.exercises = exercises;
    //    return assignInfo;
    //}
    //
    ////保存作业
    //$('#save-homework').on('click', function () {
    //    var data = gtHomeworkData();
    //    if (!data) return false;
    //    $.post('/api/v1/homework', data, function () {
    //        location.href = '/teacher/homework';
    //    });
    //});

});
