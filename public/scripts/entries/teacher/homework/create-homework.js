'use strict';

var Vue = require('vue');
var VueAsyncData = require('vue-async-data');
var _ = require('underscore');

var app = require('../../../common/app');
var upload = require('../../../common/uploadifive');
var QuizComponent = require('../../../components/exercise');

Vue.component('quiz', QuizComponent);
Vue.use(VueAsyncData);

$(document).ready(function () {
    app = app();
    var homeworkInfo = new Vue({
        el: '#homeworkInfo',
        data: {
            classes: [],
            title: '',
            keyPointRecord: '',
            addQuizBase: true
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
            getData: function () {
                if (!this.isValid()) {
                    return false;
                }
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
                return true;
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

    var exerciseList = new Vue({
        el: '#exerciseList',
        data: {quizzes: []},
        methods: {

            addQuiz: function (eType) {
                this.quizzes.push({eType: eType});
            },

            deleteQuiz: function (index) {
                this.quizzes.splice(index, 1);
            },

            isValid: function () {
                var i;
                for (i = 0; i < this.quizzes.length; i++) {
                    var child = this.$children[i];
                    if (!child.isValid()) {
                        return false;
                    }
                }
                return true;
            },
            getData: function () {
                if (!this.isValid()) {
                    return false;
                }
                if (this.quizzes.length === 0) {
                    app.notify.danger("请添加题目");
                    return false;
                }
                return _.map(this.$children, function (child) {
                    return child.getData();
                })
            }
        }
    });


    //保存作业
    $('#save-homework').on('click', function () {
        var homework;
        var exercises;
        var data;
        homework = homeworkInfo.getData();
        if (!homework) {
            return false;
        }
        exercises = exerciseList.getData();
        if (!exercises) {
            return false;
        }
        data = {
            homework: homework,
            exercises: exercises
        };
        $.post('/api/v1/homework', data).then(function (res) {
            app.notify.success("保存作业成功");
        });
    });

});
