<template>
	<div
		class="tree-menu-group"
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
		<icon
			name="fold-arrow"
			class="icon fold-arrow"
			:class="foldArrowClasses"
			color="var(--webx-primary)"
		>
		</icon>
		<icon :name="icon" class="icon" color="var(--webx-primary)"></icon>
		<name :item="item" v-if="item"></name>
		<popup :item="item!" :x="x" :y="y" v-model:showing="showingPopup"></popup>
	</div>
	<slot :children="children" v-if="expand"></slot>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, toRefs, computed, ref } from 'vue';
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
import { Icon } from '../../icon';
import VerticalLine from './VerticalLine.vue';
import Popup from './Popup.vue';
import Name from './Name.vue';

export default defineComponent({
	components: { Icon, VerticalLine, Popup, Name },
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

		const children = treeMenu.children(item.value.id);

		const expand = treeMenu.expand(item.value.id!);

		const focused = treeMenu.focused;

		const selected = treeMenu.selected;

		const status = treeMenu.status(item.value.id!);

		const dragOvering = treeMenu.dragOver(item.value.id!);

		const el = ref<HTMLElement>();

		onMounted(async () => {
			if (expand.value) {
				await children.reload();
			}
		});

		const icon = computed(() => {
			if (expand.value) {
				return 'open-folder';
			}

			return 'folder';
		});

		const foldArrowClasses = computed(() => {
			if (expand.value) {
				return 'fold-arrow-rotate';
			}

			return 'folder';
		});

		const click = async (event: MouseEvent) => {
			if (event.shiftKey) {
				shiftAddSelected(treeMenu, el.value!, item.value.id!);
			} else if (event.ctrlKey) {
				addOrRemoveSelected(selected, item.value.id!);
			} else {
				expand.value = !expand.value;

				if (expand.value) {
					await children.reload();
				}
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
				styles.push('tree-menu-group-focused');
			}

			if (selected.value?.includes(item.value.id!)) {
				styles.push('tree-menu-group-selected');
			}

			if (dragOvering.value) {
				styles.push('tree-menu-group-drag-overing');
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
			status,
			classes,
			onPopup,
			x,
			y,
			showingPopup,
			click,
			foldArrowClasses,
			id,
			icon,
			children: children.value,
			expand,
		};
	},
});
</script>

<style css scoped>
.tree-menu-group {
	display: flex;
	align-items: center;
	user-select: none;
	cursor: pointer;
	padding-left: 1em;
	width: 100%;
	height: 2em;
	box-sizing: border-box;
}

.tree-menu-group-drag-overing {
	background-color: var(--webx-focus-background);
}

.tree-menu-group:hover {
	background-color: var(--webx-secondary-background);
}

.tree-menu-group-selected {
	background-color: var(--webx-secondary-background);
}

.tree-menu-group-focused {
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

.fold-arrow {
	margin-right: 0.3em;
}

.fold-arrow-rotate {
	transform: rotateZ(90deg);
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
