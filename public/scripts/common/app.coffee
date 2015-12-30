require 'bootstrap'
require 'slimscroll'
require './jqueryExtend';
notify = require "./notify"

module.exports = ()->
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


  $('.slimscroll').slimscroll({
    alwaysVisible: false
    allowPageScroll: false
    height: "auto"
  })

  $('#gotop').click ()->
    $(document).scrollTop(0)



