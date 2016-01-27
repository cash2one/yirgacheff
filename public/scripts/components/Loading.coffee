Vue = require 'vue'

template = """
<div class='loaders'>
   <div class="loader">
    <div class="loader-inner ball-scale-multiple">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</div>
"""

Loading = Vue.extend({
  template: template
})

module.exports = Loading