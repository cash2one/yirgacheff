/**
 * Created by Frank on 15/8/7.
 */

define(['jquery', 'imageLibrary', 'layerWrapper', 'redactor'],
    function ($, imgLib, layer) {
        var render = function (elemId) {
            $('#' + elemId).redactor({
                buttons: ['bold', 'italic', 'deleted', 'fontcolor', 'backcolor', 'formatting', 'outdent', 'indent', 'file', 'alignment', 'horizontalrule'],
                focus: true,
                formatting: ['p', 'blockquote', 'h1', 'h2'],
                buttonsAdd: ['addImage', 'addVideo'],
                buttonsCustom: {
                    addImage: {
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
                    },
                    addVideo: {
                        title: '插入视频',
                        callback: function (obj) {
                            layer.open({
                                title: '插入视频链接',
                                contentId: 'insertVideo',
                                okCallback: function (index) {
                                    obj.insertHtml($('#videoLink').val());
                                    layer.close(index);
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
