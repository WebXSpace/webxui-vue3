<template>
	<div class="button-base" :class="buttonClasses">
		<loading size="1em" v-if="loading" :color="color"></loading>
		<a v-else>{{ text }}</a>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { Loading } from '../loading';
export default defineComponent({
	components: {
		Loading,
	},
	props: {
		background: {
			type: String,
			default: 'var(--webx-background)',
		},
		color: {
			type: String,
			default: 'var(--webx-primary)',
		},
		text: {
			type: String,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const { disabled } = toRefs(props);

		const buttonClasses = computed(() => {
			if (disabled.value) {
				return 'button-disabled';
			}

			return 'button-enabled';
		});

		return { buttonClasses };
	},
});
</script>

<style css scoped>
.button-base {
	padding-block: 0.5em;
	border-radius: var(--webx-border-radius);
	border: solid var(--webx-border-width) var(--webx-border-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-inline: 2em;
	user-select: none;
}
.button-enabled {
	color: v-bind(color);
	background-color: v-bind(background);
	transition: all var(--animate-duration) linear;
}

.button-enabled:hover {
	transform: scale(0.98);
}

.button-disabled {
	color: var(--webx-secondary);
	background-color: var(--webx-background);
}
</style>
