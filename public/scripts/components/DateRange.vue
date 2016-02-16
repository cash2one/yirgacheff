<template>
<div>
<div class="col-xs-3">
	<date-picker placeholder="开始日期"
	:on-select="selectStart"
	:max-date="endTime"
	:value="startTime">
	</date-picker>
</div>
<div class="col-xs-3">
	<date-picker placeholder="结束日期"
	:on-select="selectEnd"
	:min-date="startTime"
	:value="endTime">
	</date-picker>
</div>
</div>
</template>

<script lang='babel'>
import {
	defaultProps
}
from './utils/props';
import DatePicker from './DatePicker.vue';
export default {

	props: defaultProps({
		startTime: '',
		endTime: ''
	}),

	components: {
		'date-picker': DatePicker
	},

	methods: {
		selectStart: function(date) {
			this.startTime = date;
		},
		selectEnd: function(date) {
			this.endTime = date;
		}
	}
}

</script>