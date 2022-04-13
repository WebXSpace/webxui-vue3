<template>
	<icon
		name="switch-on"
		class="switch-icon"
		@click="onclick"
		color="var(--webx-accent)"
		v-if="on"
	></icon>
	<icon
		name="switch-off"
		class="switch-icon"
		@click="onclick"
		color="var(--webx-secondary)"
		v-else
	></icon>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { Icon } from '../icon';

export default defineComponent({
	components: {
		Icon,
	},
	props: {
		on: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['update:on'],
	setup(props, { emit }) {
		const { on } = toRefs(props);

		const onclick = () => {
			emit('update:on', !on.value);
		};

		return {
			onclick,
		};
	},
});
</script>

<style css scoped>
.switch-icon {
	width: 2em;
	height: 2em;
	margin-block: auto;
	user-select: none;
	cursor: pointer;
}
</style>
