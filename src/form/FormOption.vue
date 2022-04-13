<template>
	<div class="form-option" @mouseover="mouseover" @mouseleave="mouseleave" ref="from">
		<slot>
			<a class="selected">{{ selected }}</a>
		</slot>
		<Icon name="down" class="down" :color="color" :class="downClassses"></Icon>
		<teleport to="body">
			<div
				class="popup"
				v-if="showing"
				ref="to"
				:style="{ left: x, top: y }"
				@mouseover.stop="mouseover"
				@mouseleave.stop="mouseleave"
			>
				<slot name="op" :op="op" v-for="op in options">
					<a class="op" @click="onSelect(op)">{{ op }}</a>
				</slot>
			</div>
		</teleport>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType, ref } from 'vue';
import IconButton from '../button/IconButton.vue';
import Icon from '../icon/Icon.vue';
import { popupRect } from '../popup';

export default defineComponent({
	props: {
		selected: {
			type: String,
			required: true,
		},
		options: {
			type: Object as PropType<string[]>,
			required: true,
		},
	},
	emits: ['update:selected'],
	components: { IconButton, Icon },
	setup(props, { emit }) {
		const fontColor = ref('var(--webx-secondary)');

		const color = ref('var(--webx-border-color)');

		const showing = ref(false);

		let preparePopup = false;

		const x = ref('0px');

		const y = ref('0px');

		const from = ref<HTMLElement>();
		const to = ref<HTMLElement>();

		const downClassses = ref('right');

		const mouseover = () => {
			color.value = 'var(--webx-accent)';
			fontColor.value = 'var(--webx-primary)';
			downClassses.value = '';

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

				const rect = popupRect(fromRect, toRect, 'bottomRight', 2);

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
			}, 400);

			color.value = 'var(--webx-border-color)';
			fontColor.value = 'var(--webx-secondary)';
			downClassses.value = 'right';
		};

		const onSelect = (op: string) => {
			preparePopup = false;
			showing.value = false;
			emit('update:selected', op);
			color.value = 'var(--webx-border-color)';
			fontColor.value = 'var(--webx-secondary)';
			downClassses.value = 'right';
		};

		return {
			onSelect,
			downClassses,
			from,
			to,
			mouseover,
			mouseleave,
			color,
			fontColor,
			showing,
			x,
			y,
		};
	},
});
</script>

<style css scoped>
.form-option {
	position: relative;
	min-width: 80px;
	border: solid var(--webx-border-width) v-bind(color);
	height: 2em;
	margin-block: auto;
	border-radius: var(--webx-border-radius);
	display: flex;
	align-items: center;
	padding-inline: var(--webx-padding-size);
	user-select: none;
	cursor: pointer;
	transition: all var(--animate-duration) ease-in-out;
}

.form-option:hover {
	box-shadow: inset 0 0 var(--webx-focus-shadow-width) var(--webx-shadow-color);
}

.selected {
	flex: 1;
	color: v-bind(fontColor);
	font-size: 0.8em;
	font-weight: 300;
}

.down {
	width: 1em;
	height: 1em;
	transition: all var(--animate-duration) ease-in-out;
}

.right {
	transform: rotateZ(-90deg);
}

.popup {
	user-select: none;
	cursor: pointer;
	position: absolute;
	min-width: calc(160px + 2 * var(--webx-padding-size));
	width: fit-content;
	height: fit-content;
	max-height: 600px;
	font-size: 0.8em;
	font-weight: 300;
	background-color: var(--webx-background);
	border: solid var(--webx-border-width) var(--webx-border-color);
	box-shadow: 0 0px var(--webx-focus-shadow-width) var(--webx-shadow-color);
	color: var(--webx-secondary);
	border-radius: var(--webx-border-radius);
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	-webkit-app-region: no-drag;
}

.op {
	padding: var(--webx-padding-size);
}

.op:hover {
	color: var(--webx-primary);
	background-color: var(--webx-secondary-background);
}
</style>
