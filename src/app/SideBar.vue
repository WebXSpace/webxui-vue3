<template>
	<div class="sider-bar">
		<div class="menu-list">
			<slot name="menus"></slot>
		</div>

		<div class="content">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onUnmounted, ref } from 'vue';
import { mountMenuGroup, unmountMenuGroup } from '../menu';

export default defineComponent({
	props: {
		selected: {
			type: String,
			default: '',
		},
	},
	emits: ['update:selected'],
	setup(props, { expose, emit }) {
		const instance = getCurrentInstance()!;

		mountMenuGroup(instance);

		onUnmounted(() => {
			unmountMenuGroup(instance);
		});

		const selected = ref(props.selected);

		expose({
			selected,
			popup: ref(false),
			onclick: (path: string, selectable: boolean) => {
				if (selectable) {
					selected.value = path;
				}

				emit('update:selected', path);
			},
			select: (path: string) => {
				selected.value = path;
			},
		});
	},
});
</script>

<style css scoped>
.sider-bar {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
}

.menu-list {
	position: relative;
	max-width: 4em;
	min-width: 4em;
	background-color: var(--webx-accent-background);
	height: calc(100% - var(--webx-padding-size) - var(--webx-app-frame-sysbar-height));
	display: flex;
	flex-direction: column;
	padding-block-start: 1.8em;
	padding-block-end: var(--webx-padding-size);
	align-items: center;
	border-right: solid var(--webx-border-width) var(--webx-border-color);
	-webkit-app-region: drag;
}

.content {
	flex: 1;
}
</style>
