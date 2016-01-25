/**
 * Created by Frank on 15/8/7.
 */
window.UEDITOR_HOME_URL = '/js/lib/ueditor/';

module.exports.render = function (elemId) {

    var imageToolsTemplate = $(' <div class="img-tools" id="J-imgTools">' +
        '<span data-operate="border">边框</span>' +
        '<span data-operate="shadow">阴影</span>' +
        '<span data-operate="circle">圆形</span>' +
        '<span data-operate="delete">删除</span>' +
        '</div>');

    var selectToolsTemplate = $('<div class="edit-tools" id="J-editTools">' +
        '<span data-operate="copy">复制</span>' +
        '<span data-operate="cut" class="">剪切</span>' +
        '<span data-operate="delete">删除</span>' +
        '<span data-operate="insert-before">前空行</span>' +
        '<span data-operate="insert-after">后空行</span>' +
        '</div>');

    $('body').append(imageToolsTemplate).append(selectToolsTemplate);
    var imgTools = $("#J-imgTools");
    var selectedTools = $("#J-editTools");
    var editor = UE.getEditor(elemId, {
        toolbars: [[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'paragraph', 'fontsize', '|', 'indent',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|', 'insertvideo', 'horizontal', 'inserttable'
        ]],
        initialFrameHeight: 600,
        autoHeightEnabled: false,
        elementPathEnabled: false,
        autoFloatEnabled: false,
        textarea: 'content'
    });


    //选区
    function editorItemSelect(select_target) {
        imgTools.hide();
        select_target.addClass("warp-node").siblings().removeClass("warp-node");
        var $editor = $("#ueditor_0");
        var content = $($editor[0].contentWindow.document.body);
        var top = select_target.offset().top + select_target.height() - content.scrollTop();
        var left = select_target.offset().left;
        selectedTools.css({
            top: top + 95,
            left: left + 465,
            display: "block"
        });
        selectedTools.show();
        selectedTools.off().on("click", "span", function () {
            switch ($(this).data("operate")) {
                case "delete":
                    select_target.remove();
                    selectedTools.hide();
                    break;
                case "insert-before":
                    $("<p>&nbsp;</p>").insertBefore(select_target);
                    break;
                case "insert-after":
                    $("<p>&nbsp;</p>").insertAfter(select_target);
                    break;
            }
        });
        editor.addListener('selectionchange', function () {
            var g = new ZeroClipboard(selectedTools.find("span:eq(0)"));
            var f = new ZeroClipboard(selectedTools.find("span:eq(1)"));
            ZeroClipboard.config({swfPath: "/js/ZeroClipboard.swf"});
            g.on("copy", function (a) {
                var b = content.find(".360weixin.warp-node").prop("outerHTML");
                a.clipboardData.setData("text/html", b);
                a.clipboardData.setData("text/plain", b)
            });
            f.on("copy", function (a) {
                var b = content.find(".360weixin.warp-node").prop("outerHTML");
                a.clipboardData.setData("text/html", b);
                a.clipboardData.setData("text/plain",
                    b)
            });
            f.on("aftercopy", function () {
                content.find(".360weixin.warp-node").remove();
                selectedTools.hide()
            })
        })

    }

    //图片操作
    function imgItemSelect(target) {
        selectedTools.hide();
        var $editor = $("#ueditor_0");
        var content = $($editor[0].contentWindow.document.body);
        content.find(".360weixin").removeClass("warp-node");
        var top = target.offset().top + target.height() - content.scrollTop();
        var left = target.offset().left;
        imgTools.css({
            top: top + 85,
            left: left + 465,
            display: "block"
        });
        imgTools.show();
        imgTools.off().on("click", "span", function () {
            switch ($(this).data("operate")) {
                case "border":
                    var border = target.css("border");
                    if (!border || border.indexOf('none') !== -1) {
                        target.css({border: "5px solid #dfdfdf"});
                    } else {
                        target.css({border: "none"})
                    }
                    break;
                case "shadow":
                    var shadow = target.css("box-shadow");
                    if (!shadow || shadow.indexOf('none') !== -1) {
                        target.css({"box-shadow": "0 2px 5px rgba(0,0,0,0.3)"});
                    } else {
                        target.css({"box-shadow": "none"});
                    }
                    break;
                case "circle":
                    var radius = target.css("border-radius");
                    if (!radius || radius.indexOf('0px') !== -1) {
                        target.css({"border-radius": "50%"});
                    } else {
                        target.css({"border-radius": "0px"});
                    }
                    break;
                case "delete":
                    target.remove();
                    imgTools.hide();
                    break;
            }
        });
    }

    window.onload = function () {
        editor.addListener('click', function (type, event) {
            var target = $(event.target);
            var tag = target.context.tagName;
            if (tag === "IMG") {
                imgItemSelect(target);
            } else {
                var select_target = target.closest(".360weixin");
                if (select_target.length > 0) {
                    editorItemSelect(select_target);
                } else {
                    var $editor = $("#ueditor_0");
                    var content = $($editor[0].contentWindow.document.body);
                    imgTools.hide();
                    selectedTools.hide();
                    content.find(".360weixin").removeClass("warp-node");
                }
            }
        })
    };
    return editor
};

