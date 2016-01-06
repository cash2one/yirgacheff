/**
 * Created by Frank on 15/8/7.
 */
window.UEDITOR_HOME_URL = '/js/lib/ueditor/';
module.exports.render = function (elemId) {
    return UE.getEditor(elemId, {
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
};
