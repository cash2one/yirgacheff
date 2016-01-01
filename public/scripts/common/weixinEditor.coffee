#微信编辑器事件

module.exports = (opts)->


  #颜色切换
  $('.colorpick').on 'click', 'li', (event)->
    event.preventDefault()
    color = $(this).css('background-color');
    event.stopPropagation();
    alert "选择颜色" + color

  #绑定组件点击事件
  callback = opts.callback
  $('.wx-editor-template-content').on 'click', '.item', ()->
    content = $(this).innerHTML
    if typeof callback is 'function'
      callback(content)

