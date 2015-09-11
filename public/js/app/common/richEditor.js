/**
 * Created by Frank on 15/8/7.
 */

define(['jquery', 'imageLibrary', 'redactor'],
    function ($, imgLib) {
        var render = function (elemId) {
            $('#' + elemId).redactor({
                buttons: ['bold', 'italic', 'deleted', 'fontcolor', 'backcolor', 'formatting', 'outdent', 'indent', 'file', 'alignment', 'video', 'horizontalrule'],
                focus: true,
                formatting: ['p', 'blockquote', 'h1', 'h2'],
                buttonsAdd: ['button1'],
                buttonsCustom: {
                    button1: {
                        title: '图库选择',
                        callback: function (obj) {
                            imgLib.selectCallback({
                                multi: true,
                                onSelected: function (keys) {
                                    var html = '';
                                    if (keys.length > 0) {
                                        for (var i = 0; i < keys.length; i++) {
                                            var url = 'http://resource.hizuoye.com/' + keys[i];
                                            html += '<img src="' + url + '" >';
                                        }
                                    }
                                    obj.insertHtml(html);
                                }
                            });
                        }
                    }
                }
            });
        };
        return {
            render: render
        };
    });
