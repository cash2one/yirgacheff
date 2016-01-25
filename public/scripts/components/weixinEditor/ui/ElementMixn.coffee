module.exports =
  ready: ()->
    vm = this
    $('.item').click ()->
      vm.$dispatch 'element-select', $(this).html()