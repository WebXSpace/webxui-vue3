<template>
	<div class="color-icon">
		{{ text }}
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, effect, ref, toRefs } from 'vue';
import { randomColor } from '../color';
export default defineComponent({
	props: {
		content: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const { content } = toRefs(props);

		const text = ref('');

		const color = ref('');

		effect(() => {
			text.value = content.value.substring(0, 2);
			color.value = randomColor(content.value);
		});

		return {
			text,
			color,
		};
	},
});
</script>

<style css scoped>
.color-icon {
	border-radius: 50%;
	padding: var(--webx-padding-size);
	background-color: v-bind(color);
	color: white;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	user-select: none;
}
</style>
