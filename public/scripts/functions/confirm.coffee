content = (msg = "确定删除吗?")-> """
  <p class='f-black f-s-13 m-t-xs'>
   <i class='fa fa-exclamation-triangle f-pink m-r-xs'></i>#{msg}
  </p>
   <div class='text-right'>
      <button class='btn btn-white btn-xs m-t-xxs m-r-xs'>取消</button>
      <button class='btn btn-pink btn-xs m-t-xxs m-r-xs'>确定</button>
    </div>
"""

$.fn.extend
  confirm: (msg, callback)->
    $(this).popover({
      content: content(msg, callback)
      html: true
    })


