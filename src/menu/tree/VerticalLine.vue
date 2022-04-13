<template>
	<div class="vertical-line" v-for="index in depth - 1" :key="index"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		depth: {
			type: Number,
			required: true,
		},
	},
});
</script>

<style css scoped>
.vertical-line {
	pointer-events: none;
	min-width: 1.5em;
	height: 100%;
	border-left: solid var(--webx-border-width) var(--webx-secondary-background);
}
</style>
