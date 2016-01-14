'use strict';

var _ = require('underscore');
var Vue = require('vue');
var VueAsyncData = require('vue-async-data');
var app = require('../../../common/app');
var upload = require('../../../common/uploadifive');
var QuizComponent = require('../../../components/exercise');

Vue.component('quiz', QuizComponent);
Vue.use(VueAsyncData);

$(document).ready(function () {
    app = app();

    new Vue({
        el: "#createHomework",
        data: {
            classes: [],
            title: '',
            keyPointRecord: '',
            addQuizBase: true,
            exercises: []
        },
        asyncData: function (resolve, reject) {
            var quizId = $.getUrlParam('quizId');
            if (quizId !== null) {
                $.get('/api/v1/quizzes/' + quizId).then(function (quiz) {
                    resolve({
                        exercises: quiz.exercises
                    })
                });
            }
        },
        methods: {
            addClass: function (e) {
                var selected = $(e.target).closest('li');
                var id = selected.attr('id');
                selected.toggleClass('active');
                if (selected.hasClass('active')) {
                    this.classes.push(id);
                } else {
                    this.classes = _.filter(this.classes, function (clazz) {
                        return clazz !== id;
                    })
                }
            },
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
                if (this.classes.length === 0) {
                    app.notify.danger("请选择班级");
                    return false;
                }
                if (_.isEmpty(this.title)) {
                    app.notify.danger("作业标题不能为空");
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
            saveHomework: function () {
                if (!this.isValid()) {
                    return false;
                }
                $.post('/api/v1/homework', this.getData()).then(function (res) {
                    app.notify.success("保存作业成功");
                    self.location.href = "/teacher/homework";
                });
            }
        },
        ready: function () {
            var self = this;
            upload({
                file: 'localAudioUploadButton',
                fileType: 'audio/mpeg',
                done: function (res) {
                    self.keyPointRecord = res.key;
                }
            });
        }
    });
});
