<template>
	<div class="color-option" @mouseover="mouseover" @mouseleave="mouseleave" ref="from">
		<div class="color-icon" :style="{ 'background-color': colorOf(selected) }"></div>
		<a class="color-text" v-if="showingText">{{ selected.toUpperCase() }}</a>
		<teleport to="body">
			<div
				class="popup"
				v-if="showing"
				ref="to"
				:style="{ left: x, top: y }"
				@mouseover="mouseover"
				@mouseleave="mouseleave"
			>
				<div class="popup-item" v-for="item in options" @click="onSelect(item)">
					<div class="color-icon" :style="{ 'background-color': colorOf(item) }"></div>
					<a class="color-text">{{ item.toUpperCase() }}</a>
				</div>
			</div>
		</teleport>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType, ref, toRefs } from 'vue';
import { randomColor } from '../color';
import { Direction, popupRect } from '../popup';

export default defineComponent({
	props: {
		options: {
			type: Object as PropType<string[]>,
			required: true,
		},
		selected: {
			type: String,
			required: true,
		},
		showingText: {
			type: Boolean,
			default: false,
		},
		direction: {
			type: String as PropType<Direction>,
			default: () => 'bottomRight' as Direction,
		},
	},
	emits: ['update:selected'],
	setup(props, { emit }) {
		const { direction } = toRefs(props);

		const colorOf = (op: string) => {
			return randomColor(op);
		};

		const showing = ref(false);

		let preparePopup = false;

		const x = ref('0px');

		const y = ref('0px');

		const from = ref<HTMLElement>();
		const to = ref<HTMLElement>();

		const mouseover = () => {
			if (preparePopup) {
				return;
			}

			preparePopup = true;

			showing.value = true;

			nextTick(() => {
				if (!preparePopup) {
					return;
				}

				const fromRect = from.value?.getBoundingClientRect() ?? new DOMRect(0, 0);

				const toRect = to.value?.getBoundingClientRect() ?? new DOMRect();

				const rect = popupRect(fromRect, toRect, direction.value, 2);

				x.value = `${rect.x}px`;
				y.value = `${rect.y}px`;
			});
		};

		const mouseleave = () => {
			preparePopup = false;
			setTimeout(() => {
				if (!preparePopup) {
					showing.value = false;
				}
			}, 200);
		};

		const onSelect = (op: string) => {
			preparePopup = false;
			showing.value = false;
			emit('update:selected', op);
		};

		return {
			colorOf,
			onSelect,
			showing,
			x,
			y,
			mouseover,
			mouseleave,
			from,
			to,
		};
	},
});
</script>

<style css scoped>
.color-option {
	display: flex;
	align-items: center;
	transition: all var(--animate-duration) ease-in-out;
	cursor: pointer;
	user-select: none;
	width: fit-content;
}

.color-icon {
	width: 1em;
	height: 1em;
	border-radius: 0.5em;
}

.color-text {
	font-size: 0.8em;
	color: var(--webx-primary);
	margin-inline-start: var(--webx-padding-size);
}

.popup {
	z-index: 10000;
	position: absolute;
	display: flex;
	flex-direction: column;
	width: 10em;
	max-height: 50vh;
	border: solid var(--webx-border-width) var(--webx-border-color);
	box-shadow: 0 0 14px var(--webx-shadow-color);
	background-color: var(--webx-background);
	overflow-y: auto;
	overflow-x: hidden;
	border-radius: var(--webx-border-radius);
	user-select: none;
	cursor: pointer;
	padding: var(--webx-border-radius);
	border-left: solid var(--webx-border-radius) var(--webx-accent);
}

.popup-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-block: var(--webx-padding-size);
	padding-inline: var(--webx-padding-size);
}

.popup-item:hover {
	background-color: var(--webx-shadow-color);
	border-radius: var(--webx-border-radius);
}
</style>
