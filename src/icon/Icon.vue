<template>
	<svg-icon v-if="name != ''" :name="name" :color="color"></svg-icon>
	<img :src="url" v-else />
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import svgIcon from './svgIcon.vue';
export default defineComponent({
	components: {
		svgIcon,
	},
	props: {
		name: {
			type: String,
			default: '',
		},
		url: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			default: 'var(--webx-secondary)',
		},
	},
	setup(props) {
		const { name, url } = toRefs(props);

		if (name.value == '' && url.value == '') {
			throw new Error('you should set any one of name or url');
		}
	},
});
</script>

<style css scoped></style>
