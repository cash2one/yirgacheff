module.exports =

  events:
    'change-color': (color)->
      $this = $(this.$el)
      $this.find(".item .wxqq-bg").css({backgroundColor: color})
      $this.find(".item .wxqq-color").css({color: color});
      borders = [
        ".wxqq-borderTopColor"
        ".wxqq-borderRightColor"
        ".wxqq-borderBottomColor"
        ".wxqq-borderLeftColor"
        ".wxqq-borderColor"]

      $.each borders, (border)-> $this.find(border).css({'border-color': color})

  ready: ()->
    vm = this
    $('.item').click ()->
      vm.$dispatch 'element-select', $(this).html()