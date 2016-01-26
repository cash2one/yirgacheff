module.exports =

  events:
    'change-color': (color)->
      $this = $(this.$el)
      $this.find(".item .wxqq-bg").css({backgroundColor: color})
      $this.find(".item .wxqq-color").css({color: color});
      borders =
        ".wxqq-borderTopColor":'top'
        ".wxqq-borderRightColor":'right'
        ".wxqq-borderBottomColor":'bottom'
        ".wxqq-borderLeftColor":'left'
      $.each borders, (c,p)-> $this.find(c).css("border-#{p}-color",color)

  ready: ()->
    vm = this
    $('.item').click ()->
      vm.$dispatch 'element-select', $(this).html()