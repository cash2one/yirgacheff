/**
 * Created by Admin on 2016/1/18.
 */

'use strict';

require('../../../common/formvalidator');
var app = require('../../../common/app');
var strftime = require('strftime');
var Vue = require('vue');
var VueAsyncData = require('vue-async-data');
Vue.use(VueAsyncData);

$(document).ready(function () {
    app = app();
    var eventId = $("#eventId").val();
    Vue.filter('date', function (value) {
        return strftime('%F %T', new Date(value));
    });
    Vue.component('task-modal', {
        data: function () {
            return {
                task: {
                    _id: null,
                    title: '',
                    scoreAward: 0
                }
            };
        },
        template: '#taskModalTemplate',
        methods: {
            add: function () {
                var self = this;
                var task = self.task;
                if (_.trim(task.title) === '') {
                    return app.notify.danger("任务名称不能为空");
                }
                if (isNaN(task.scoreAward)) {
                    return app.notify.danger("奖励积分必须位数字");
                }
                var url = '/api/v1/events/' + eventId + '/tasks';
                var data = {
                    title: task.title,
                    scoreAward: task.scoreAward
                };
                if (task._id !== null) {
                    data._id = task._id;
                }
                $.post(url, data).then(function (task) {
                    self.$dispatch('add-task', task);
                    $(self.$el).modal("hide");
                    if (task._id !== null) {
                        app.notify.success("修改成功");
                    } else {
                        app.notify.success("添加成功");
                    }
                });
            }
        },
        events: {
            show: function (task) {
                this.task = _.assign({}, task);
                $(this.$el).modal("show");
            }
        }
    });

    Vue.component('task-item', {
        props: ['task', 'index'],
        template: '#taskTemplate',
        methods: {
            modify: function () {
                this.$parent.showModal(this.task, this.index);
            },
            delete: function () {
                var self = this;
                if (confirm("确定删除任务?")) {
                    $.ajax({
                        url: '/api/v1/events/' + eventId + '/tasks/' + this.task._id,
                        method: 'DELETE'
                    }).then(function () {
                        self.$dispatch('delete-task', self.index);
                        app.notify.success("删除任务成功");
                    });
                }
            },
            close: function () {
                var self = this;
                if (confirm("确定关闭任务?")) {
                    $.ajax({
                        url: '/api/v1/events/' + eventId + '/tasks/' + this.task._id + '/close',
                        method: 'PUT'
                    }).then(function () {
                        self.$dispatch('close-task', self.index);
                        app.notify.success("关闭任务成功");
                    })
                }
            },
            open: function () {
                var self = this;
                if (confirm("确定打开任务?")) {
                    $.ajax({
                        url: '/api/v1/events/' + eventId + '/tasks/' + this.task._id + '/open',
                        method: 'PUT'
                    }).then(function () {
                        self.$dispatch('open-task', self.index);
                        app.notify.success("打开任务成功");
                    })
                }
            }
        }
    });

    new Vue({
        data: {
            tasks: []
        },
        asyncData: function (resolve, reject) {
            $.get('/api/v1/events/' + eventId + '/tasks').then(function (tasks) {
                resolve({
                    tasks: tasks
                })
            });
        },
        methods: {
            showModal: function (task) {
                this.$refs.modal.$emit('show', task || {});
            },

            addTask: function (task) {
                var index = _.findIndex(this.tasks, function (tk) {
                    return task._id === tk._id;
                });
                if (index !== -1) {
                    this.tasks.$set(index, task);
                } else {
                    this.tasks.push(task);
                }
            },

            deleteTask: function (index) {
                this.tasks.splice(index, 1);
            },

            openTask: function (index) {
                var task = this.tasks[index];
                task.state = 0;
                this.tasks.$set(index, task);
            },

            closeTask: function (index) {
                var task = this.tasks[index];
                task.state = 1;
                this.tasks.$set(index, task);
            }
        },
        el: '#taskApp'
    });

    $("#taskScore").validate(function ($form, data) {
        $.post('/api/v1/events/' + data.eventId + '/tasks', data).then(function (event) {
            app.notify.success("添加任务成功");
        });

    });
});
