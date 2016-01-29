<template>
<div class='form-group enroll-field'>
	<label class='control-label col-xs-2'>
		{{field.label || '自定义'}}
	</label>
	<div class='col-xs-10'>
		<input class='form-control' type='text'
		v-model='field.label'>
		<i class='fa fa-times f-gray f-s-16 pull-right m-t-n-lg m-r-xs' @click='delete'></i>
	</div>
</div>
</template>


<script lang='babel'>
	export default {
		props: ['field', 'index'],
		methods: {
			delete: function() {
				this.$dispatch('delete', this.index);
			}
		}
	}
</script>