<template>
	<div class="form">
		<slot></slot>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		maxHeight: {
			type: String,
			default: '600px',
		},
	},
});
</script>
<style css scoped>
.form {
	border-radius: var(--webx-border-radius);
	padding-block: calc(var(--webx-padding-size) / 2);
	padding-inline: var(--webx-padding-size);
	width: calc(100% - 2 * var(--webx-padding-size));
	background-color: var(--webx-secondary-background);
	max-height: v-bind(maxHeight);
	overflow-y: auto;
}
</style>
