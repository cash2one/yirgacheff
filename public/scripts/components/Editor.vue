<template>
	<textarea placeholder="{{placeholder}}">{{content}}</textarea>
</template>

<script lang='babel'>
 import {
 	defaultProps
 }
 from './utils/props';
 import 'trumbowyg/dist/ui/trumbowyg.css';
 import 'trumbowyg/dist/trumbowyg.min';
 import 'trumbowyg/dist/langs/zh_cn.min';

 export default {

 	props: defaultProps({
 		content: '',
 		placeholder:'写点什么'
 	}),

 	ready: function() {
 	  console.log('content is ',this.content);
 		var self = this;
    //初始化editor
 		var editor = $(this.$el).trumbowyg({
 			lang: 'zh_cn',
 			semantic: false,
 			fullscreenable: false,
 			btns: ['bold', 'italic', '|', 'link']
 		});
 		if(self.content !== ''){
 		  $(this.$el).trumbowyg('html',self.content);
 		}

   //监听blur事件
 		$(this.$el).on('tbwblur', function(){
 			self.content = editor.trumbowyg('html');
 		});

 		//初始化editor 内容
 		editor.trumbowyg('html', self.content);
 	}


 };
</script>