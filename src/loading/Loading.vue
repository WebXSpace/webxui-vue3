<template>
	<div class="lds-ring">
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';

export default defineComponent({
	props: {
		size: {
			type: String,
			default: '10px',
		},
		color: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		const refs = toRefs(props);

		const color = computed(() => {
			if (refs.color.value == '') {
				return 'var(--webx-accent)';
			}

			return refs.color.value;
		});

		return {
			color,
		};
	},
});
</script>

<style css scoped>
.lds-ring {
	display: inline-block;
	position: relative;
	width: v-bind(size);
	height: v-bind(size);
}
.lds-ring div {
	box-sizing: border-box;
	display: block;
	position: absolute;
	width: calc(v-bind(size) - v-bind(size) / 5);
	height: calc(v-bind(size) - v-bind(size) / 5);
	margin: calc(v-bind(size) / 10);
	border: 2px solid v-bind(color);
	border-radius: 50%;
	animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	border-color: v-bind(color) transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
	animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
	animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
	animation-delay: -0.15s;
}
@keyframes lds-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
