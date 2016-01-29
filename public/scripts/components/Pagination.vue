<template>
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
</template>


<script lang="babel">
import Vue from 'vue';
import * as _ from 'underscore';

export default Vue.extend({

  props: ['total', 'limit'],

  data: function() {
    return {
      current: 1
    };
  },

  methods: {
    next: function() {
      this.current = Math.min(1, this.current - 1)
    },
    previous: function() {
      this.current = Math.max(this.total, this.current + 1)
    }
  },

  watch: {
    'current': function(val, old) {
      this.$dispatch('page-change', val)
    },
    'total': function() {
      this.current = 1;
    }
  },

  computed: {

    isFirst: function() {
      return this.current === 1;
    },

    isLast: function() {
      return this.pageSize === 1 || 
             this.current === this.pageSize;
    },

    pageSize: function() {
      return Math.ceil(this.total / this.limit);
    },

    pageNumbers: function() {
      if (this.pageSize <= 9) {
        return _.range(1, this.pageSize + 1);
      } else {
        let left = Math.max(1, this.current - 2);
        let right = Math.min(this.current + 2, this.pageSize);
        if (this.current <= 3) {
          right = 5; //页码小于等于3的时候,肯定是从第一页开始计算
        }
        if (this.pageSize - this.current <= 2) {
          left = this.pageSize - 4;
        }
        return _.range(left, right + 1);
      }
    }
  }
});

</script>
