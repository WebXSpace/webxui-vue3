<template>
	<icon
		:name="name"
		:url="url"
		:color="color"
		class="icon-button"
		@mouseover="mouseover"
		@mouseleave="mouseleave"
	></icon>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { defineComponent, ref, toRefs } from 'vue';
import { Icon } from '../icon';
export default defineComponent({
	components: {
		Icon,
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
		primary: {
			type: String,
			default: 'var(--webx-secondary)',
		},
		secondary: {
			type: String,
			default: 'var(--webx-border-color)',
		},
		border: {
			type: Boolean,
			default: true,
		},
	},
	setup(props) {
		const { primary, secondary, border } = toRefs(props);

		const color = ref(secondary.value);

		const mouseover = () => {
			color.value = primary.value;
		};

		const mouseleave = () => {
			color.value = secondary.value;
		};

		const borderColor = computed(() => {
			if (!border.value) {
				return 'transparent';
			}

			return color.value;
		});

		return {
			borderColor,
			color,
			mouseover,
			mouseleave,
		};
	},
});
</script>

<style css scoped>
.icon-button {
	-webkit-app-region: no-drag;
	user-select: none;
	cursor: pointer;
	width: 1em;
	height: 1em;
	display: flex;
	align-items: center;
	justify-content: center;
	align-self: center;
	border: solid var(--webx-border-width) v-bind(borderColor);
	padding: 0.2em;
	border-radius: var(--webx-border-radius);
}
</style>
