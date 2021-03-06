<template>
	<input v-model="input" :placeholder="placeholder" class="form-input" v-focus:form-input />
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
.form-input {
	flex: 1;
	align-items: center;
	border-radius: var(--webx-border-radius);
	padding-block: 0.5em;
	background-color: transparent;
	font-size: 0.8em;
	font-weight: 300;
	width: 100%;
	margin-block: auto;
	padding-inline: 1em;
	min-width: var(--webx-input-mini-width);
	outline-style: none;
}

.form-input-unfocus {
	border: solid var(--webx-border-width) var(--webx-border-color);
	color: var(--webx-secondary);
	box-shadow: inset 0 0 var(--webx-focus-shadow-width) var(--webx-shadow-color);
}

.form-input-hover,
.form-input-focus {
	border: solid var(--webx-border-width) var(--webx-accent);
	color: var(--webx-primary);
	box-shadow: inset 0 0 var(--webx-focus-shadow-width) var(--webx-shadow-color);
}

.form-input::placeholder {
	font-weight: 100;
	color: var(--webx-secondary);
}
</style>
