/**
 * Created by Admin on 2016/1/11.
 */
'use strict';
var app = require('../../../common/app');


$(document).ready(function() {
  app();
  var wxUrl = $("#wxUrl").val();
  var eventTitle = $("#eventTitle").val();
  window._bd_share_config = {
    common: {
      bdText: '我在360家校云发布一个活动，欢迎来参加——#' + eventTitle,
      bdUrl: wxUrl
    },
    share: [{
      "bdStyle": "1",
      "bdSize": 32
    }]
  };
  (document.getElementsByTagName('head')[0] || body)
  .appendChild(document.createElement('script'))
    .src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5);

  $(".deleteEvent").click(function() {

    var eventId = $(this).attr('id');
    if (confirm("确定要删除该活动?")) {
      $.ajax({
        url: '/api/v1/events/' + eventId,
        method: 'DELETE'
      }).then(function() {
        self.location.href = "/school/events/manage"
      });
    }
  });

  function jsCopy(){
    var e=document.getElementById("copyFromTxt");//对象是content
    e.select(); //选择对象
    document.execCommand("Copy"); //执行浏览器复制命令
    alert("已复制好，可贴粘。");
  }
  $("#copyBtn").click(function() {
     jsCopy();
  });
});
