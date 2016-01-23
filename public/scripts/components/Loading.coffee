Vue = require 'vue'

Loading = Vue.extend({
  props: ['loading']
  template: """
<div class='loaders'>
   <div class="loader" v-show="loading">
    <div class="loader-inner ball-scale-multiple">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</div>
  """
})

module.exports = Loading