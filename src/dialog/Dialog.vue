<template>
	<teleport to="body">
		<div
			class="dialog"
			v-if="showing"
			@click.self="clickMask"
			@wheel.self="e => e.preventDefault()"
		>
			<transition
				name="custom-classes-transition"
				enter-active-class="animate__animated animate__slideInUp"
				leave-active-class="animate__animated animate__slideOutDown"
			>
				<div
					v-if="showingContent"
					class="dialog-content"
					:style="{
						width: width,
						height: reactiveHeight,
					}"
				>
					<slot></slot>
				</div>
			</transition>
		</div>
	</teleport>
</template>
<script lang="ts">
import {
	computed,
	defineComponent,
	effect,
	nextTick,
	onMounted,
	onUnmounted,
	onUpdated,
	ref,
	toRefs,
} from 'vue';
import { useDevice } from '../device';

export default defineComponent({
	props: {
		showing: {
			type: Boolean,
			required: true,
		},
		width: {
			type: String,
			default: 'fit-content',
		},
		height: {
			type: String,
			default: 'fit-content',
		},
		mobileHeight: {
			type: String,
			default: '40%',
		},
		maskClick: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['update:showing'],
	setup(props, { emit }) {
		const { height, mobileHeight, showing, maskClick } = toRefs(props);

		const device = useDevice();

		const reactiveHeight = computed(() => {
			if (device.value == 'MOBILE') {
				return mobileHeight.value;
			}

			return height.value;
		});

		const showingContent = ref(showing.value);

		effect(() => {
			if (showing.value) {
				nextTick(() => {
					showingContent.value = showing.value;
				});
			} else {
				nextTick(() => {
					showingContent.value = showing.value;
				});
			}
		});

		const clickMask = () => {
			if (maskClick.value) {
				showingContent.value = false;
				setTimeout(() => emit('update:showing', false), 200);
			}
		};

		const onEscape = (e: KeyboardEvent) => {
			if (showing.value && e.key === 'Escape') {
				clickMask();
			}
		};

		onMounted(() => {
			window.addEventListener('keydown', onEscape);
		});

		onUnmounted(() => {
			window.removeEventListener('keydown', onEscape);
		});

		return {
			device,
			clickMask,
			reactiveHeight,
			showingContent,
		};
	},
});
</script>

<style css scoped>
.dialog {
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	-webkit-app-region: no-drag;
	z-index: 1000;
}

.dialog-content {
	background: var(--webx-background);
	border-radius: var(--webx-border-radius);
	box-shadow: 0 0 20px var(--webx-shadow-color);
	border-top: solid var(--webx-border-radius) var(--webx-accent);
	border-bottom: solid var(--webx-border-width) var(--webx-accent);
	border-left: solid var(--webx-border-width) var(--webx-accent);
	border-right: solid var(--webx-border-width) var(--webx-accent);
	overflow: hidden;
}

@media (max-width: 600px) {
	.dialog {
		flex-direction: column;
		justify-content: flex-end;
	}

	.dialog-content {
		min-width: calc(100% - 2 * var(--webx-border-width));
		max-width: calc(100% - 2 * var(--webx-border-width));
		border-radius: var(--webx-border-radius) var(--webx-border-radius) 0 0;
	}
}
</style>
