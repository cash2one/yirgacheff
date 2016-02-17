<template>
	<input type='text' 
    class="datepicker-here form-control" 
	  :placeholder="placeholder" />
</template>

<script lang='babel'>
  import {
    defaultProps
  }
  from './utils/props';
  require('air-datepicker/dist/css/datepicker.min.css');
  require('expose?Datepicker!exports?Datepicker!air-datepicker/dist/js/datepicker');
  require('air-datepicker/dist/js/i18n/datepicker.zh');

  function getDate(val) {
    if(!val || val === '') return;
    if(typeof val !== 'string') return val;
    if(val === 'now') return new Date();
    return new Date(val);
  }
  export default {

    props: defaultProps({
      defaultValue:'',
      range: false,
      view: 'days',
      separator: ',',
      multi: false,
      placeholder: '选择日期',
      minDate: '',
      maxDate: '',
      onSelect: () => {}
    }),

    data: function() {
      return {
        datepicker: {}
      }
    },

    ready: function() {
      $(this.$el).datepicker({
          language: 'zh',
          autoClose: true,
          clearButton: true,
          view: this.view,
          minView: this.view,
          range: this.range,
          minDate: '',
          maxDate: '',
          onSelect: this.onSelect,
          multipleDates: this.multi,
          multipleDatesSeparator: this.separator
      });
      
      if(this.defaultValue !== ""){
        $(this.$el).data('datepicker').selectDate(getDate(this.defaultValue));
      }

      if(this.minDate !== ""){
        $(this.$el).data('datepicker').update('minDate',getDate(this.minDate));
      }

      if(this.maxDate !== ""){
        $(this.$el).data('datepicker').update('maxDate',getDate(this.maxDate));
      }
    },

    watch: {
      'minDate': function(val, old) {
        if (val !== '') {
          $(this.$el).data('datepicker').update('minDate',getDate(val));
        }
      },
      'maxDate': function(val, old) {
        if (val !== '') {
          $(this.$el).data('datepicker').update('maxDate',getDate(val));
        }
      }
    }
  };
</script>