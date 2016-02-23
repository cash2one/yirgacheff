<template>
	<textarea placeholder="{{placeholder}}"></textarea>
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
 		var self = this;
    //初始化editor
 		var editor = $(this.$el).trumbowyg({
 			lang: 'zh_cn',
 			semantic: false,
 			fullscreenable: false,
 			btns: ['bold', 'italic', '|', 'link']
 		});

   //监听blur事件
 		$(this.$el).on('tbwblur', function(){
 			self.content = editor.trumbowyg('html');
 		});

    console.log('content is ', self.content);
 		//初始化editor 内容
 		editor.trumbowyg('html', self.content);
 	}


 };
</script>