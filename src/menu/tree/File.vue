<template>
	<div
		class="tree-menu-file"
		:class="classes"
		:id="id"
		@click="click"
		@contextmenu="onPopup"
		draggable="true"
		@dragstart="dragStart"
		@dragenter="dragEnter"
		@dragover="dragOver"
		@dragleave="dragLeave"
		@drop="drop"
		ref="el"
	>
		<vertical-line :depth="depth"></vertical-line>
		<icon name="edit" class="icon" color="var(--webx-primary)"></icon>
		<name :item="item" v-if="item"></name>
		<popup :item="item!" :x="x" :y="y" v-model:showing="showingPopup"></popup>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue';
import {
	IEntry,
	toElementId,
	useTreeMenu,
	addSelected,
	onDragEnter,
	onDragOver,
	onDragLeave,
	onDrop,
	onDragStart,
	shiftAddSelected,
	addOrRemoveSelected,
} from './tree';
import VerticalLine from './VerticalLine.vue';
import { Icon } from '../../icon';
import Popup from './Popup.vue';
import Name from './Name.vue';

export default defineComponent({
	components: {
		Name,
		Popup,
		Icon,
		VerticalLine,
	},
	props: {
		item: {
			type: Object as PropType<IEntry>,
			required: true,
		},
		depth: {
			type: Number,
			required: true,
		},
	},
	setup(props) {
		const { item } = toRefs(props);

		const id = computed(() => {
			return toElementId(item.value.id!);
		});

		const treeMenu = useTreeMenu();

		const focused = treeMenu.focused;

		const selected = treeMenu.selected;

		const dragOvering = treeMenu.dragOver(item.value.id!);

		const el = ref<HTMLElement>();

		const click = async (event: MouseEvent) => {
			if (event.shiftKey) {
				shiftAddSelected(treeMenu, el.value!, item.value.id!);
			} else if (event.ctrlKey) {
				addOrRemoveSelected(selected, item.value.id!);
			} else {
				selected.value = undefined;
				addSelected(selected, item.value.id!);
			}

			focused.value = item.value.id;
		};

		const x = ref(0);

		const y = ref(0);

		const showingPopup = ref(false);

		const onPopup = (event: MouseEvent) => {
			x.value = event.pageX;
			y.value = event.pageY;
			showingPopup.value = true;
			focused.value = item.value.id;
		};

		const classes = computed(() => {
			const styles = [];
			if (focused.value == item.value.id) {
				styles.push('tree-menu-file-focused');
			}

			if (selected.value?.includes(item.value.id!)) {
				styles.push('tree-menu-file-selected');
			}

			if (dragOvering.value) {
				styles.push('tree-menu-file-drag-overing');
			}

			return styles;
		});

		const dragStart = async (event: DragEvent) => {
			await onDragStart(event, treeMenu, item.value);
		};

		const dragEnter = async (event: DragEvent) => {
			await onDragEnter(event, treeMenu, item.value);
		};

		const dragOver = async (event: DragEvent) => {
			await onDragOver(event, treeMenu, item.value);
		};

		const dragLeave = async (event: DragEvent) => {
			await onDragLeave(event, treeMenu, item.value);
		};

		const drop = async (event: DragEvent) => {
			await onDrop(event, treeMenu, item.value);
		};

		return {
			el,
			dragStart,
			dragEnter,
			dragOver,
			dragLeave,
			drop,
			classes,
			x,
			y,
			onPopup,
			showingPopup,
			click,
			id,
		};
	},
});
</script>

<style css scoped>
.tree-menu-file {
	display: flex;
	align-items: center;
	user-select: none;
	cursor: pointer;
	padding-left: 2.5em;
	width: 100%;
	height: 2em;
	box-sizing: border-box;
}

.tree-menu-file-drag-overing {
	background-color: var(--webx-focus-background);
}

.tree-menu-file:hover {
	background-color: var(--webx-secondary-background);
}
.tree-menu-file-selected {
	background-color: var(--webx-secondary-background);
}
.tree-menu-file-focused {
	box-shadow: inset 0 0 1px var(--webx-focus-border);
	background-color: var(--webx-focus-background);
}

.icon {
	pointer-events: none;
	min-width: 1.2em;
	max-width: 1.2em;
	min-height: 1.2em;
	max-height: 1.2em;
	transition: all var(--animate-duration) ease-in-out;
}

.title {
	margin-left: 0.5em;
	flex: 1;
	text-overflow: ellipsis;
	word-break: keep-all;
	white-space: nowrap;
	overflow: hidden;
	pointer-events: none;
	color: var(--webx-primary);
}
</style>
