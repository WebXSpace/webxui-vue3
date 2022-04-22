<template>
	<icon
		:name="name"
		:url="url"
		:color="color"
		class="icon-button"
		v-focus="onFocusChanged"
	></icon>
</template>

<script lang="ts">
import { computed, watch, watchEffect } from 'vue';
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
		disabled: {
			type: String,
			required: false,
		},
	},
	setup(props) {
		const { primary, secondary, border, disabled } = toRefs(props);

		const color = ref(secondary.value);

		const focused = ref(false);

		const borderColor = ref('transparent');

		watchEffect(() => {
			if (disabled.value) {
				color.value = disabled.value;
			} else {
				if (focused.value) {
					color.value = primary.value;
				} else {
					color.value = secondary.value;
				}
			}

			if (border.value) {
				if (disabled.value) {
					borderColor.value = disabled.value;
				} else if (focused.value) {
					borderColor.value = primary.value;
				} else {
					borderColor.value = secondary.value;
				}
			} else {
				borderColor.value = 'transparent';
			}
		});

		const onFocusChanged = (status: string) => {
			if (status == 'unfocus') {
				focused.value = false;
			} else {
				focused.value = true;
			}
		};

		return {
			onFocusChanged,
			borderColor,
			color,
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
