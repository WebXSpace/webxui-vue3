<template>
	<teleport to="body">
		<div v-if="showing" class="context-menu-mask" @click.self="dismiss">
			<div class="context-menu" :style="{ left, top, width }" ref="el">
				<slot></slot>
			</div>
		</div>
	</teleport>
</template>

<script lang="ts">
import {
	defineComponent,
	effect,
	getCurrentInstance,
	nextTick,
	onUnmounted,
	ref,
	toRefs,
} from 'vue';
import { popupRect } from '../popup';
import { mountMenu, mountMenuGroup, unmountMenuGroup } from './menu';

export default defineComponent({
	props: {
		width: {
			type: String,
			default: '15em',
		},
		selected: {
			type: String,
			default: '',
		},
		showing: {
			type: Boolean,
			required: true,
		},
		x: {
			type: Number,
			required: true,
		},
		y: {
			type: Number,
			required: true,
		},
	},
	emits: ['update:selected', 'update:showing'],
	setup(props, { expose, emit }) {
		const instance = getCurrentInstance()!;

		mountMenuGroup(instance);

		onUnmounted(() => {
			unmountMenuGroup(instance);
		});

		const selected = ref(props.selected);

		const { x, y, showing } = toRefs(props);

		expose({
			selected,
			popup: ref(false),
			onclick: (path: string, selectable: boolean) => {
				if (selectable) {
					selected.value = path;
				}
				emit('update:showing', false);
				emit('update:selected', path);
			},
			select: (path: string) => {
				selected.value = path;
			},
		});

		const dismiss = () => {
			emit('update:showing', false);
		};

		const el = ref<HTMLElement>();

		const left = ref('0px');

		const top = ref('0px');

		effect(() => {
			if (!showing.value) {
				return;
			}

			nextTick(() => {
				const fromRect = new DOMRect(x.value, y.value);

				const toRect = el.value?.getBoundingClientRect() ?? new DOMRect();

				const rect = popupRect(fromRect, toRect, 'bottomLeft', 0);

				left.value = `${rect.x}px`;
				top.value = `${rect.y}px`;
			});
		});

		return {
			left,
			top,
			el,
			dismiss,
		};
	},
});
</script>

<style css scoped>
.context-menu {
	height: fit-content;
	border: solid var(--webx-border-width) var(--webx-border-color);
	box-shadow: -1px 1px 12px var(--webx-shadow-color);
	background-color: var(--webx-secondary-background);
	border-radius: var(--webx-border-radius);
	backdrop-filter: blur(16px);
	display: flex;
	flex-direction: column;
	user-select: none;
	cursor: pointer;
	overflow: hidden;
	box-sizing: border-box;
	padding-block: var(--webx-border-radius);
	padding-inline: calc(var(--webx-border-radius) / 2);
	position: absolute;
}

.context-menu-mask {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	-webkit-app-region: no-drag;
	z-index: 10000;
}
</style>
