/**
 * Created by Frank on 15/8/7.
 */
window.UEDITOR_HOME_URL = '/js/lib/ueditor/';
module.exports.render = function (elemId) {

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


    var imgTools = $("#J-imgTools");
    var selectedTools = $("#J-editTools");
    //选区
    function editorItemSelect(){

        var $editor = $("#ueditor_0");
        var content = $($editor[0].contentWindow.document.body);
        function editSelected(a) {
            selectedTools.off().on("click", "span", function () {
                switch ($(this).data("operate")) {
                    case "delete":
                        a.remove();
                        selectedTools.hide();
                        imgTools.hide();
                        break;
                    case "insert-before":
                        $("<p>&nbsp;</p>").insertBefore(a);
                        break;
                    case "insert-after":
                        $("<p>&nbsp;</p>").insertAfter(a);
                        break;
                }
            })
        }
        content.on("click", ".360weixin", function () {
            imgTools.hide();
            $(this).toggleClass("warp-node").siblings().removeClass("warp-node");
            var top = $(this).offset().top + $(this).height() - content.scrollTop();
            var left = $(this).offset().left + $editor.offset().left;
            if($(this).hasClass("warp-node")){
                console.log($(this).offset().top,$editor.offset().top,top);
                selectedTools.css({
                    top: top + 95,
                    left: left + 45,
                    display: "block"
                });
                editSelected($(this));
            }else{
                selectedTools.hide()
            }
        });
        editor.addListener( 'selectionchange', function() {
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
    function imgItemSelect() {
        var $editor = $("#ueditor_0");
        var content = $($editor[0].contentWindow.document.body);
        function editImg(a) {
            imgTools.off().on("click", "span", function () {
                switch ($(this).data("operate")) {
                    case "border":
                        var border = a.css("border");
                        if(!border || border.indexOf('none') !== -1){
                            a.css({border:"5px solid #dfdfdf"});
                        }else{
                            a.css({border:"none"})
                        }
                        break;
                    case "shadow":
                        var shadow = a.css("box-shadow");
                        if(!shadow || shadow.indexOf('none') !== -1){
                            a.css({"box-shadow":"0 2px 5px rgba(0,0,0,0.3)"});
                        }else{
                            a.css({"box-shadow":"none"});
                        }
                        break;
                    case "circle":
                        var radius = a.css("border-radius");
                        console.log(radius);
                        if(!radius || radius.indexOf('0px') !== -1){
                            a.css({"border-radius":"50%"});
                        }else{
                            a.css({"border-radius": "0px"});
                        }
                        break;
                }
            })
        }
        content.on("click", "img", function (event) {
            event.stopPropagation();
            selectedTools.hide();
            $(this).toggleClass("img-node").siblings().removeClass("img-node");
            var top = $(this).offset().top + $(this).height() - content.scrollTop();
            var left = $(this).offset().left;
            if($(this).hasClass("img-node")){
                imgTools.css({
                    top: top + 85,
                    left: left + 465,
                    display: "block"
                });
                editImg($(this));
            }else{
                imgTools.hide()
            }
        });
    }
    window.onload = function () {
        editorItemSelect();
        imgItemSelect();
    };


    return editor
};

