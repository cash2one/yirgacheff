"use strict";

define(['jquery', 'restfulClient', 'layer', 'underscore', 'jqueryExt'], function ($, $http, layer, _) {
        function open(options) {
            var $content = options.contentId;
            var okCallback = options.okCallback;
            var cancelCallback = options.cancelCallback;
            if (typeof $content === 'string') {
                $content = $('#' + $content);
            }
            var width = "500px";
            var configs = {
                type: 1,
                area: width,
                title: options.title || false,
                cancel: options.cancel || null,
                shift: 5,
                zIndex: 5000,
                content: $content
            };
            if (options.closeBtn === false) {
                configs.closeBtn = false;
            } else {
                configs.closeBtn = 1;
            }

            var index = layer.open(configs);
            $content.off('click.layer-close').on('click.layer-close', '.layer-close-btn', function () {
                if (cancelCallback && typeof cancelCallback === 'function') {
                    cancelCallback();
                }
                layer.close(index);
            });
            $content.off('click.layer-ok').on('click.layer-ok', '.layer-ok-btn', function () {
                okCallback(index);
            });
            return index;
        }


        function ajaxForm(options) {
            var ops = options || {};
            var $container = ops.container;
            var ajax = ops.ajax;
            var validator = ops.validator;
            var $form = ops.form;
            var cancel = ops.cancelCallback;
            var title = ops.title || false;
            if (!$container) {
                throw 'options must have a container option (id or jquery element) .';
            }
            if (!ajax || typeof ajax !== 'object') {
                throw 'options must have a ajax option'
            }
            var type = ajax.type;
            var url = ajax.url;
            var success = ajax.success;
            var error = ajax.error;
            var dataGen = ajax.data;
            if (!success || typeof success !== 'function') {
                throw 'ajax options must have a success .';
            }
            if (!url) {
                throw 'ajax options must have a url';
            }
            if (!type) {
                throw 'ajax options must have a type .';
            }
            if (type !== 'PUT' && type !== 'POST') {
                throw 'type must be "PUT" or "POST" ';
            }
            if (validator && typeof validator !== 'function') {
                throw 'validator must be a function .';
            }

            if (typeof $container === 'string') {
                $container = $('#' + $container);
            }
            if ($form && typeof $form === 'string') {
                $form = $('#' + $form);
            }
            if (!dataGen) {
                if (!$form) {
                    throw 'ajax request has no data';
                }
                dataGen = function () {
                    return $form.serializeObject();
                }
            }
            var width = "500px";
            var configs = {
                type: 1,
                area: width,
                title: title,
                shift: 5,
                zIndex: 5000,
                content: $container
            };
            var index = layer.open(configs);
            var ok = function () {
                var data;
                if (typeof dataGen === 'function') {
                    data = dataGen();
                } else {
                    data = dataGen;
                }
                if (!data) {
                    throw 'ajax request has no data';
                }
                if (validator && typeof validator === 'function') {
                    var valid = validator(data);
                    if (_.isString(valid)) {
                        layer.msg(valid);
                        //lock = false;
                        return;
                    }
                }
                var loading = layer.load();
                $http.method(true, type, url, data, function (data) {
                    success(data, function () {
                        layer.msg('操作成功');
                        layer.close(loading);
                        layer.close(index);
                    });
                }, function (err) {
                    layer.close(loading);
                    layer.msg(err.message);
                    if (error && typeof error === 'function') {
                        error(err);
                    }
                });
            };
            $container.off('click.layer-close').on('click.layer-close', '.layer-close-btn', function () {
                if (cancel && typeof cancel === 'function') {
                    cancel();
                }
                layer.close(index);
            });
            $container.off('click.layer-ok').on('click.layer-ok', '.layer-ok-btn', ok);

        }


        function confirm(msg, okCallback, closeCallback) {
            layer.confirm(msg, {title: '操作确认', btn: ['确定', '取消']},
                function (index) {
                    if (okCallback || typeof okCallback === 'function') {
                        okCallback();
                    }
                    layer.close(index);

                }, function () {
                    if (closeCallback || typeof closeCallback === 'function') {
                        closeCallback();
                    }
                });
        }

        function load(type, config) {
            if (isNullObj(config)) {
                config = {
                    shade: 0.3
                }
            }
            layer.load(type, config);
        }


        function isNullObj(obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    return false;
                }
            }
            return true;
        }

        return {
            ajaxForm: ajaxForm,
            confirm: confirm,
            msg: layer.msg,
            close: layer.close,
            alert: layer.alert,
            load: load,
            open: open,
            closeAll: layer.closeAll
        };
    }
);
