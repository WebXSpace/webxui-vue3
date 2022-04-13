<template>
	<textarea
		v-model="(input as string)"
		:placeholder="placeholder"
		class="form-text-area"
		v-focus="'form-text-area'"
	/>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

export default defineComponent({
	props: {
		text: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
	},
	emits: ['update:text'],
	setup(props, { emit }) {
		const { text } = toRefs(props);

		const input = computed({
			get() {
				return text.value;
			},
			set(value) {
				emit('update:text', value);
			},
		});

		return { input };
	},
});
</script>

<style css scoped>
.form-text-area {
	flex: 1;
	align-items: center;
	border-radius: var(--webx-border-radius);
	padding-block: 0.5em;
	background-color: transparent;
	font-size: 0.8em;
	font-weight: 300;
	width: 100%;
	padding-inline: 1em;
	min-width: var(--webx-input-mini-width);
	min-height: 5em;
	outline-style: none;
}

textarea {
	font-family: inherit;
	font-size: inherit;
}

.form-text-area-unfocus {
	border: solid var(--webx-border-width) var(--webx-border-color);
	color: var(--webx-secondary);
	box-shadow: inset 0 0 var(--webx-focus-shadow-width) var(--webx-shadow-color);
}

.form-text-area-hover,
.form-text-area-focus {
	border: solid var(--webx-border-width) var(--webx-accent);
	color: var(--webx-primary);
	box-shadow: inset 0 0 var(--webx-focus-shadow-width) var(--webx-shadow-color);
}

.form-text-area::placeholder {
	font-weight: 100;
	color: var(--webx-secondary);
}
</style>
