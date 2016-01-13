require 'slimscroll'
require './jqueryExtend'
notify = require "./notify"


$ ->
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
    if($(window).scrollTop()>100)
       $("#toTop").fadeIn()
    else $("#toTop").fadeOut()

  $('#toTop').click ()->
    $('body,html').animate({scrollTop:0},500)
    return false

  $('#message').click ()->
    $('#onlineConsultationModal').modal('show')

  $('.slimscroll').slimscroll({
    alwaysVisible: false
    allowPageScroll: false
    height: "auto"
  })


#app 导出常用的功能模块
module.exports = ()->
  notify: notify
  menu: (index)->
    $(".head-menu").find('li').removeClass('active')
    $(".head-menu").find("li:eq(#{index})").addClass('active');




