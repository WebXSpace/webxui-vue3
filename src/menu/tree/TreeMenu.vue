<template>
	<div
		class="tree-menu"
		:class="classes"
		v-focus:tree-menu
		ref="el"
		@contextmenu.self="onPopup"
		@keydown.arrow-up="arrowUp"
		@keydown.arrow-down="arrowDown"
		@keydown.enter.self="onEnter"
		@dragenter.self="dragEnter"
		@dragover.self="dragOver"
		@dragleave.self="dragLeave"
		@drop.self="drop"
	>
		<popup :item="item!" :x="x" :y="y" v-model:showing="showingPopup"></popup>
		<entry :id="item" :depth="1" v-for="item in children"></entry>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {
	removeSelected,
	useTreeMenu,
	fromElementId,
	toElementId,
	addSelected,
	onDragEnter,
	onDragOver,
	onDragLeave,
	onDrop,
} from './tree';
import Popup from './Popup.vue';
import Entry from './Entry.vue';
import { computed } from '@vue/reactivity';

export default defineComponent({
	components: {
		Popup,
		Entry,
	},
	emits: ['click'],
	setup() {
		const x = ref(0);

		const y = ref(0);

		const showingPopup = ref(false);

		const treeMenu = useTreeMenu();

		const item = treeMenu.entry();

		const children = treeMenu.children();

		const focused = treeMenu.focused;

		const selected = treeMenu.selected;

		const el = ref<HTMLElement>();

		const dragOvering = treeMenu.dragOver();

		const classes = computed(() => {
			if (dragOvering.value) {
				return 'tree-menu-drag-overing';
			}

			return undefined;
		});

		onMounted(async () => {
			await children.reload();
		});

		const onPopup = (event: MouseEvent) => {
			x.value = event.pageX;
			y.value = event.pageY;
			showingPopup.value = true;
		};

		const focusedElement = () => {
			let focusedElement: Element | undefined | null;

			if (focused.value) {
				focusedElement = document.querySelector(`#${toElementId(focused.value)}`);
			}

			return focusedElement;
		};

		const arrowKey = (event: KeyboardEvent, up: boolean) => {
			const focusedEl = focusedElement();

			let id: string | undefined;

			if (focusedEl) {
				if (up) {
					id = focusedEl.previousElementSibling?.id;
				} else {
					id = focusedEl.nextElementSibling?.id;
				}
			} else {
				id = el.value?.firstElementChild?.id;
			}

			if (id) {
				const prevId = focused.value;

				focused.value = fromElementId(id);

				if (event.shiftKey) {
					if (selected.value?.includes(focused.value)) {
						if (prevId) {
							removeSelected(selected, prevId);
						}
					} else {
						if (prevId) {
							addSelected(selected, prevId);
						}

						addSelected(selected, focused.value);
					}
				}
			}
		};

		const arrowUp = (event: KeyboardEvent) => {
			arrowKey(event, true);
		};

		const arrowDown = (event: KeyboardEvent) => {
			arrowKey(event, false);
		};

		const onEnter = () => {
			if (focused.value) {
				selected.value = undefined;
				addSelected(selected, focused.value);

				const entry = treeMenu.entry(focused.value);

				if (entry.value.value && entry.value.value.isGroup) {
					const expand = treeMenu.expand(focused.value);

					expand.value = !expand.value;
				}
			}
		};

		const dragEnter = async (event: DragEvent) => {
			await onDragEnter(event, treeMenu, item.value.value!);
		};

		const dragOver = async (event: DragEvent) => {
			await onDragOver(event, treeMenu, item.value.value!);
		};

		const dragLeave = async (event: DragEvent) => {
			await onDragLeave(event, treeMenu, item.value.value!);
		};

		const drop = async (event: DragEvent) => {
			await onDrop(event, treeMenu, item.value.value!);
		};

		return {
			dragEnter,
			dragOver,
			dragLeave,
			drop,
			onEnter,
			arrowUp,
			arrowDown,
			item: item.value,
			x,
			y,
			showingPopup,
			onPopup,
			children: children.value,
			el,
			classes,
		};
	},
});
</script>

<style css scoped>
.tree-menu {
	display: flex;
	flex-direction: column;
	/* border: solid var(--webx-border-width) transparent; */
}

.tree-menu-drag-overing {
	background-color: var(--webx-focus-background);
}

.tree-menu-hover {
	/* border: solid var(--webx-border-width) var(--webx-accent); */
}

.tree-menu-focus {
	/* border: solid var(--webx-border-width) var(--webx-accent); */
}
</style>
