<template>
	<div class="tooltip-container" @mouseover="mouseover" @mouseleave="mouseleave" ref="from">
		<teleport to="body">
			<div
				class="tooltip"
				:style="{ left: x, top: y, 'max-width': maxWidth }"
				ref="to"
				v-if="showing"
			>
				<slot name="content">
					<a class="content">{{ content }}</a>
				</slot>
			</div>
		</teleport>

		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onUnmounted, onUpdated, PropType, ref, toRefs } from 'vue';
import { popupRect, Direction } from '../popup';
export default defineComponent({
	props: {
		content: {
			type: String,
			default: '',
		},
		direction: {
			type: String as PropType<Direction>,
			required: true,
		},
		margin: {
			type: Number,
			default: 4,
		},
		maxWidth: {
			type: String,
			default: '40em',
		},
		maxHeight: {
			type: String,
			default: '10em',
		},
		delay: {
			type: Number,
			default: 200,
		},
	},
	setup(props) {
		const { direction, margin, delay } = toRefs(props);
		const showing = ref(false);

		const x = ref('0px');

		const y = ref('0px');

		const from = ref<HTMLElement>();
		const to = ref<HTMLElement>();

		let preparePopup = false;

		const mouseover = () => {
			if (preparePopup) {
				return;
			}

			preparePopup = true;

			setTimeout(() => {
				if (!preparePopup) {
					return;
				}

				preparePopup = false;

				showing.value = true;

				nextTick(() => {
					const fromRect = from.value?.getBoundingClientRect() ?? new DOMRect(0, 0);

					const toRect = to.value?.getBoundingClientRect() ?? new DOMRect();

					const rect = popupRect(fromRect, toRect, direction.value, margin.value);

					x.value = `${rect.x}px`;
					y.value = `${rect.y}px`;
				});
			}, delay.value);
		};

		const mouseleave = () => {
			preparePopup = false;
			showing.value = false;
		};

		return { showing, x, y, mouseover, mouseleave, from, to };
	},
});
</script>

<style css scoped>
.tooltip-container {
	position: relative;
	text-overflow: ellipsis;
	word-break: keep-all;
	white-space: nowrap;
	overflow: hidden;
}

.tooltip {
	font-size: 0.8em;
	position: absolute;
	z-index: 999999999999999;
	width: fit-content;
	height: fit-content;
	padding-block: 2px;
	padding-inline: 8px;
	background-color: var(--webx-secondary-background);
	border: solid var(--webx-border-width) var(--webx-border-color);
	box-shadow: 0 0px var(--webx-focus-shadow-width) var(--webx-shadow-color);
	color: var(--webx-secondary);
	border-radius: var(--webx-border-radius);
	backdrop-filter: blur(16px);
	overflow-y: auto;
}
</style>
