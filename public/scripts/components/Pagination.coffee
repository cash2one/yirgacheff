Vue = require 'vue'

template = """
<nav class='text-center'>
  <ul class="pagination">
    <li>
       <a href="javascript:void(0)" aria-label="Previous" @click='current = 1'>
         <span aria-hidden="true">首页</span>
       </a>
    </li>
    <li v-bind:class="{disabled: isFirst}">
      <a href="javascript:void(0)" aria-label="Previous" @click='previous'>
        <span aria-hidden="true">上一页</span>
      </a>
    </li>
   <li v-show='pageNumbers[0] > 1'>
        <span aria-hidden="true">...</span>
    </li>
    <li v-for='pn in pageNumbers' v-bind:class="{active: pn === current}">
      <a href="javascript:void(0)" @click='current = pn'>{{pn}}</a>
    </li>
    <li v-show='pageNumbers[pageNumbers.length -1 ] < pageSize'>
        <span aria-hidden="true">...</span>
    </li>
    <li v-bind:class="{disabled: isLast}">
      <a href="javascript:void(0)" aria-label="Next" @click='next'>
        <span aria-hidden="true">下一页</span>
      </a>
    </li>
    <li>
       <a href="javascript:void(0)" aria-label="Previous" @click='current = pageSize'>
         <span aria-hidden="true">末页</span>
       </a>
    </li>
  </ul>
</nav>
"""
Pagination = Vue.extend
  props: ['total', 'limit']

  data: ()->
    pageSize: 0
    current: 1

  template: template

  methods:
    previous: ()->
      if this.current > 1
        this.current -= 1
    next: ()->
      if this.current < this.pageSize
        this.current += 1
  watch:
    'current': (n, o)->
      this.$dispatch('page-change', n)
    'total': ()->
      this.current = 1

  computed:
    isFirst: ()->
      this.pageSize is 1 or this.current is 1

    isLast: ()->
      this.pageSize is 1 or this.current is this.pageSize

    pageSize: ()->
      Math.ceil(this.total / this.limit)

    pageNumbers: ()->
      if this.pageSize <= 9   #页码小于10就全部显示出来
        return  [1 .. this.pageSize]
      else
        left = Math.max(1, this.current - 2)
        right = Math.min(this.current + 2, this.pageSize)
        if this.current <= 3 then right = 5 #页码小于等于3的时候,肯定是从第一页开始计算
        if this.pageSize - this.current <= 2 then left = this.pageSize - 4
        return [left .. right]


module.exports = Pagination