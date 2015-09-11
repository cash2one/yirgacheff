/**
 * Created by Frank on 15/9/1.
 */


define(['jquery', 'layer'], function ($, layer) {
    $.ajaxSetup({cache: false});
    var locks = {};

    function ajax(settings, done) {

        settings.error = function (err) {
            var error = {code: err.status};
            var errorResponse = err.responseJSON;
            if (errorResponse && typeof errorResponse === 'object' && errorResponse.message) {
                error.message = errorResponse.message;
            }
            switch (err.status) {
                case 400:
                    layer.msg('this is a message');
                    layer.msg(error.message || '客户端请求错误');
                    break;
                case 401:
                    layer.msg(error.message || '您没有登陆，请登陆后再尝试');
                    break;
                case 403:
                    layer.msg(error.message || '当前操作被禁用');
                    break;
                case 404:
                    layer.msg(error.message || '请求资源未定义');
                    break;
                case 500:
                    layer.msg(error.message || '系统错误');
                    break;
            }
            done(error, null);
        };

        $.ajax(settings).done(function (res) {
            done(null, res);
        });
    }

    function method(needLock, type, url, data, success, error) {
        if (needLock && locks[url]) {
            return;
        }
        locks[url] = true;
        var settings = {url: url, method: type, type: type};
        var successCallback = success;
        var errorCallback = error;
        if (typeof data === 'function') {
            successCallback = data;
            errorCallback = success;
        } else {
            settings.data = data;
        }
        if (!successCallback || typeof successCallback !== 'function') {
            throw '未定义成功回调函数';
        }
        ajax(settings, function (err, res) {
            locks[url] = false;
            if (err) {
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback(err);
                }
                return;
            }
            successCallback(res);
        });
    }

    function get(url, data, success, error) {

        method(false, 'GET', url, data, success, error);
    }

    function post(url, data, success, error) {
        method(true, 'POST', url, data, success, error);
    }

    function put(url, data, success, error) {
        method(true, 'PUT', url, data, success, error);
    }

    function del(url, data, success, error) {
        method(true, 'DELETE', url, data, success, error);
    }

    return {
        get: get,
        post: post,
        put: put,
        del: del,
        method: method
    };

});
