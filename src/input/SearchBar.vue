<template>
	<div class="search-bar" v-focus="'search-bar'">
		<input
			v-model="input"
			class="search-input"
			:placeholder="placeholder"
			@focusin="focusin"
			@focusout="focusout"
		/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';

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

		const classes = ref('search-bar-unfocus');

		const focusin = () => {
			classes.value = 'search-bar-focus';
		};

		const focusout = () => {
			classes.value = 'search-bar-unfocus';
		};

		const input = computed({
			get() {
				return text.value;
			},
			set(value) {
				emit('update:text', value);
			},
		});

		return {
			input,
			classes,
			focusin,
			focusout,
		};
	},
});
</script>

<style css scoped>
.search-bar {
	font-size: 0.8em;
	-webkit-app-region: no-drag;
	box-sizing: content-box;
	border-radius: var(--webx-border-radius);
	transition: all var(--animate-duration) ease-in-out;
	user-select: none;
}
.search-bar-unfocus {
	border: solid var(--webx-border-width) var(--webx-border-color);
	box-shadow: inset 0 0 var(--webx-focus-shadow-width) var(--webx-shadow-color);
}
.search-bar-hover,
.search-bar-focus {
	border: solid var(--webx-border-width) var(--webx-accent);
	box-shadow: inset 0 0 var(--webx-focus-shadow-width) var(--webx-shadow-color);
}

.search-input {
	margin-inline: 1em;
	margin-block: 5px;
	background-color: transparent;
	font-size: 1em;
	font-weight: 300;
	border: 0px;
	outline-style: none;
	color: var(--webx-primary);
	height: calc(100% - 10px);
	width: calc(100% - 2em);
}

.search-input::placeholder {
	font-weight: 100;
	color: var(--webx-secondary);
}
</style>
