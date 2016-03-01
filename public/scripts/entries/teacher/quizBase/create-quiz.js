'use strict';
var _ = require('underscore');
var Vue = require('vue');
var app = require('../../../common/app');
var QuizComponent = require('../../../components/exercise');

Vue.component('quiz', QuizComponent);
$(document).ready(function () {
    app = app();
    new Vue({
        el: "#quizApp",
        data: {
            title: '',
            exercises: []
        },
        methods: {

            addExercise: function (eType) {
                this.exercises.push({eType: eType});
            },
            deleteExercise: function (index) {
                this.exercises.splice(index, 1);
            },
            getData: function () {
                this.exercises = _.map(this.$children, function (child) {
                    return child.getData();
                });
                return this.$data;
            },

            isValid: function () {
                if (_.isEmpty(this.title)) {
                    app.notify.danger("题目标题不能为空");
                    return false;
                }
                if (this.exercises.length === 0) {
                    app.notify.danger("请添加题目");
                    return false;
                }
                for (var i = 0; i < this.exercises.length; i++) {
                    var child = this.$children[i];
                    if (!child.isValid()) {
                        return false;
                    }
                }
                return true;
            },
            saveQuiz: function () {
                if (!this.isValid()) {
                    return false;
                }
                var data = $.parseJSON(JSON.stringify(this.getData()));
                $.post('/api/v1/quizzes', data).then(function (res) {
                    app.notify.success("保存题目成功");
                    self.location.href = "/teacher/quizzes";
                });
            }
        }
    });
});
