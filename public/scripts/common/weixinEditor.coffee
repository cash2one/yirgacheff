#微信编辑器事件

upload = require './uploadifive'
constants = require './constants'
RESOURCE_URL = constants.RESOURCE_URL

template = (image)->
  """
  <li class='img-item' id="imgItem">
    <div class='img-box'><img src='#{RESOURCE_URL}#{image.key}' alt='' class='img-thumbnail' style='max-width: 500px'></div>
    <div class='img-controls' style='display: none'>
        <a id="addImg">
           <div class='add-img'>
                <i class='fa fa-plus f-info'></i>
           </div>
        </a>
        <a id="deleteImg">
           <div class='delete-img'>
                <i class='iconfont icon-shanchu f-pink'></i>
           </div>
        </a>
    </div>
  </li>
 """

module.exports = (opts)->
  editor = opts.editor;

  #颜色切换
  $('.colorpick').on 'click', 'li', (event)->
    event.preventDefault()
    color = $(this).css('background-color');
    $(this).closest(".dropdown").find(".bg-color").css({backgroundColor: color})
    event.stopPropagation();
    $(".item .wxqq-bg").css({backgroundColor: color})
    $(".item .wxqq-color").css({color: color});
    border = ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor","borderColor"]
    clazz = [];
    $.each border, (position)-> clazz.push(".item .wxqq-" + border[position])
    $.each clazz, (name)-> $(clazz[name]).css(border[name], color)

  #绑定组件点击事件
  $('.wx-editor-template-content').on 'click', '.item', ()->
    content = $(this).html()
    editor.execCommand('insertHtml',content);

  $.get '/api/v1/medias', (images)->
    templates = images.map template
    $("#weixinGallery").append(templates.join '')

  #初始化图库上传功能
  upload({
    button: 'weixinEditorImgUpload',
    multi: true,
    done: (uploads)->
      $.post('/api/v1/medias', {uploads: uploads}).then ()->
        templates = uploads.map template
        firstItem = $("#weixinGallery").find(".item:first")
        $(templates.join '').insertBefore firstItem
  })

  #图片添加删除展现
  $('.wx-editor-template-content').on 'mouseover', '#imgItem', ()->
    $(this).find('.img-controls').show()

  $('.wx-editor-template-content').on 'mouseout', '#imgItem', ()->
    $(this).find('.img-controls').hide()

  #添加图片
  $('.wx-editor-template-content').on 'click', '#addImg', ()->
    content = $(this).closest(".img-item").find(".img-box").html()
    editor.execCommand('insertHtml',content);
  #删除图片
  $('.wx-editor-template-content').on 'click', '#deleteImg', ()->


