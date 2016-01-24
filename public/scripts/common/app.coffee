require 'slimscroll'
require './jqueryExtend'
notify = require "./notify"


$ ->
  pendingRequests = {}
  #ajax 防止重复提交
  $.ajaxPrefilter (options, originalOptions, jqXHR)->
#去掉浏览器添加的 _参数 ()
    key = options.url
    if not pendingRequests[key]? and key.indexOf '.html' is -1
      pendingRequests[key] = jqXHR
    else if key.indexOf '.html' is -1
      jqXHR.abort()

    complete = options.complete
    options.complete = (jqXHR, textStatus)->
      pendingRequests[key] = null
      if $.isFunction complete
        complete.apply this, arguments

  $.ajaxSetup({
    dataType: "json"
  })

  $(document).ajaxError (event, error) ->
    res = error.responseJSON or {};
    message = res.error
    switch error.status
      when 400 then notify.danger message or "请求错误"
      when 401 then notify.danger "您没有登陆"
      when 403 then notify.danger "您没有操作权限"
      when 404 then notify.danger "请求未定义,请联系管理员"
      when 500 then notify.danger "系统错误,请联系管理员"
      else
        notify.danger "出错啦"

  $('[data-toggle="tooltip"]').tooltip()

  $("#toTop").hide()

  $(window).scroll ()->
    if($(window).scrollTop() > 100)
      $("#toTop").fadeIn()
    else $("#toTop").fadeOut()

  $('#toTop').click ()->
    $('body,html').animate({scrollTop: 0}, 500)
    return false

  $('#message').click ()->
    $('#onlineConsultationModal').modal('show')

  $('#weiXinEwm').hover(
    ()-> $('#ewmDialog').fadeIn()
  , ()-> $('#ewmDialog').fadeOut()
  );

  $('.slimscroll').slimscroll({
    alwaysVisible: false
    allowPageScroll: false
    height: "auto"
  })

  $('.inner-menu li a').each ()->
    if($($(this))[0].href == String(window.location))
      $(this).closest('.item').addClass('active')

#app 导出常用的功能模块
module.exports = ()->
  notify: notify





