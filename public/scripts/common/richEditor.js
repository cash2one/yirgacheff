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
    function editorItemSelect(){
        function editSelected(a) {
            selected.editTools.off().on("click", "span", function () {
                switch ($(this).data("operate")) {
                    case "delete":
                        a.remove();
                        selected.editTools.hide();
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

        var selected = this, content = $(document.getElementById("ueditor_0").contentWindow.document.body);
        selected.editTools = $("#J-editTools");
        content.off().on("click", ".360weixin", function () {
            $(this).toggleClass("warp-node").siblings().removeClass("warp-node");
            var top = $(this).offset().top + $("#ueditor_0").offset().top;
            var left = $(this).offset().left + $("#ueditor_0").offset().left;
            $(this).hasClass("warp-node") ? (selected.editTools.css({
                top: top -
                35, left: left, display: "block"
            }), editSelected(content)) : selected.editTools.hide()
        });
        var g = new ZeroClipboard(selected.editTools.find("span:eq(0)")), f = new ZeroClipboard(selected.editTools.find("span:eq(1)"));
        //ZeroClipboard.config({swfPath: "/js/ZeroClipboard.swf"});
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
            selected.editTools.hide()
        });
    }
    function imgItemSelect() {
        function editImg($img) {
            imgTools.off().on("click", "span", function () {
                switch ($(this).data("operate")) {
                    case "border":
                        var border = $img.css("border");
                        if(!border || border.indexOf('none') !== -1){
                            $img.css({border:"5px solid #dfdfdf"});
                        }else{
                            $img.css({border:"none"})
                        }
                        break;
                    case "shadow":
                        var shadow = $img.css("box-shadow");
                        if(!shadow || shadow.indexOf('none') !== -1){
                            $img.css({"box-shadow":"0 2px 5px rgba(0,0,0,0.3)"});
                        }else{
                            $img.css({"box-shadow":"none"});
                        }
                        break;
                    case "circle":
                        var radius = $img.css("border-radius");
                        console.log(radius);
                        if(!radius || radius.indexOf('0px') !== -1){
                            $img.css({"border-radius":"50%"});
                        }else{
                            $img.css({"border-radius": "0px"});
                        }
                        break;
                }
            })
        }
        var content = $(document.getElementById("ueditor_0").contentWindow.document.body);
        var imgTools = $("#J-imgTools");
        content.off().on("click", "img", function () {
            var $img = $(this);
            $img.toggleClass("img-node").siblings().removeClass("img-node");
            var top = $img.offset().top + $("#ueditor_0").offset().top;
            var left = $img.offset().left + $("#ueditor_0").offset().left;
            $img.hasClass("img-node") ? (imgTools.css({
                top: top -
                35, left: left, display: "block"
            }),editImg($img)) : imgTools.hide()
        });
    }
    window.onload = function () {
        editorItemSelect();
        imgItemSelect();
    };
    return editor
};

