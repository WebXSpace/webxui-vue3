<template>
	<div class="copy-text" v-clipboard:copy="text" v-clipboard:success="click">
		<a class="text">{{ text }}</a>
		<icon class="icon" :name="icon" :color="color"> </icon>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Icon } from '../icon';
export default defineComponent({
	components: {
		Icon,
	},
	props: {
		text: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			default: 'var(--webx-primary)',
		},
	},
	setup() {
		const icon = ref('copy');

		const click = () => {
			if (icon.value == 'copy') {
				icon.value = 'success';
				setTimeout(() => {
					icon.value = 'copy';
				}, 1000);
			}
		};

		return {
			icon,
			click,
		};
	},
});
</script>

<style css scoped>
.copy-text {
	display: flex;
	align-items: center;
	user-select: none;
	cursor: pointer;
}

.text {
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: keep-all;
	white-space: nowrap;
	font-weight: 100;
}
.icon {
	width: 1em;
	height: 1em;
	min-width: 1em;
	min-height: 1em;
	margin-left: 0.5em;
}
</style>
