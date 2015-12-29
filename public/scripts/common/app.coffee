require 'bootstrap'
require 'slimscroll'
require './jqueryExtend';

module.exports = ()->
  $('.slimscroll').slimscroll({
    allowPageScroll: true
    height:"auto"
  })

  $('#gotop').click ()->
    $(document).scrollTop(0)



