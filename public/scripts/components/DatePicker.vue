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
        var val = this.defaultValue;
        if(typeof val === "string"){
          if(val === "now"){
            val = new Date();
          }else{
            val = new Date(val);
          }
        }
        $(this.$el).data('datepicker').selectDate(val);
      }
    },

    watch: {
      'minDate': function(val, old) {
        if (val !== '') {
          $(this.$el).data('datepicker').update('minDate', new Date(val))
        }
      },
      'maxDate': function(val, old) {
        if (val !== '') {
          $(this.$el).data('datepicker').update('maxDate', new Date(val));
        }
      }
    }
  };
</script>