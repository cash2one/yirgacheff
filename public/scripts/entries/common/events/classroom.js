/**
 * Created by Admin on 2016/1/10.
 */
'use strict';
require('../../../common/formvalidator');
var _ = require('underscore');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var upload = require('../../../common/uploadifive');
var Vue = require('vue');

$(document).ready(function () {
    app();
    upload({
        file: 'imageUpload',
        done: function (file) {
            $('#indexImage').attr('src', file.path);
            $('#coverImage').val(file.key);
        }
    });
    Vue.component('video-item', {
        props: ['video', 'index'],
        template: '#videoTemplate',
        methods: {
            delete: function () {
                this.$dispatch('delete-video', this.index);
            },
            edit: function () {
                this.$dispatch('edit-video', this.index);
            }
        }
    });

    Vue.component('video-modal', {
        data: function () {
            return {
                video: {}
            }
        },
        template: '#videoModal',
        methods: {
            close: function () {
                $(this.$el).modal("hide");
            },
            add: function () {
                var video = this.video;
                if (!video.link || video.link === "") {
                    return notify.danger("链接不能为空");
                }
                console.log(video.link.indexOf("embed"));
                if (video.link.indexOf("iframe") === -1 && video.link.indexOf("embed") === -1) {
                    var handleLink = '<embed src="'+ video.link +'" allowFullScreen="true" quality="high" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>';
                    video.link = handleLink;
                }
                if (!video.title || video.title === "") {
                    return notify.danger("标题不能为空");
                }
                this.$dispatch('add-video', this.video);
                this.close();
            }
        },
        events: {
            show: function (video) {
                this.video = _.assign({}, video);
                $(this.$el).modal("show");
            }
        }
    });

    var vm = new Vue({
        el: "#classroomApp",
        data: {
            videos: window.courses || []
        },
        methods: {
            showModal: function () {
                this.$refs.modal.$emit('show', {});
            },

            addVideo: function (video) {
                if (typeof video._id !== 'undefined') {
                    this.videos.$set(video.index, video);
                } else {
                    video._id = this.videos.length;
                    this.videos.push(video);
                }
            },

            deleteVideo: function (index) {
                this.videos.splice(index, 1);
            },

            editVideo: function (index) {
                this.$refs.modal.$emit('show', this.videos[index]);
            }
        }
    });


    $("#videoForm").validate(function ($form, data) {
        var videos = vm.videos;
        if (videos.length === 0) {
            notify.danger("请至少添加一个课程视频");
            return;
        }
        data.courses = videos;
        data.template = 'classroom';
        $.post('/api/v1/events', data).then(function () {
            self.location.href = "/school/events/manage"
        });
    });

});