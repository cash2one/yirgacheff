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

    //初始化editor
 		$(this.$el).trumbowyg({
 			lang: 'zh_cn',
 			semantic: false,
 			fullscreenable: false,
 			btns: ['bold', 'italic', '|', 'link']
 		});

   //监听blur事件
 		$(this.$el).on('tbwblur', function(){
 			this.content = $(this.$el).trumbowyg('html');
 		});

 		//初始化editor 内容
 		$(this.$el).trumbowyg('html', this.content);
 	}


 };
</script>