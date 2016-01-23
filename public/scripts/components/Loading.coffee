Vue = require 'vue'

Loading = Vue.extend({
  props: ['loading']
  template: """
        <div v-show="loading">
            <img class="center-block" src="/images/xubox_loading0.gif">
        </div>
  """
})

module.exports = Loading