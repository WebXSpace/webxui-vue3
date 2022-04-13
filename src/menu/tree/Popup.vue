<template>
	<context-menu :showing="showing" @update:showing="updateShowing" :x="x" :y="y">
		<menu-item
			name="New directory"
			icon="open"
			@click="addNewDirectory"
			v-if="item.isGroup"
		></menu-item>
		<menu-item name="New file" icon="new" @click="addNewFile" v-if="item.isGroup"></menu-item>
		<menu-item name="Rename" icon="edit" @click="onEdit" v-if="!item.readonly"></menu-item>
		<menu-item name="Delete" icon="delete" @click="onDelete" v-if="!item.readonly"></menu-item>
	</context-menu>
</template>

<script lang="ts">
import { defineComponent, toRefs, PropType, ref, onMounted } from 'vue';

import { IEntry, Status, useTreeMenu } from './tree';

import ContextMenu from '../ContextMenu.vue';
import MenuItem from '../MenuItem.vue';

export default defineComponent({
	components: {
		ContextMenu,
		MenuItem,
	},
	props: {
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
		item: {
			type: Object as PropType<IEntry>,
			required: true,
		},
	},
	emits: ['update:showing'],
	setup(props, { emit }) {
		const { item } = toRefs(props);

		const updateShowing = (flag: boolean) => {
			emit('update:showing', flag);
		};

		const treeMenu = useTreeMenu();

		const status = item.value.id ? treeMenu.status(item.value.id) : ref<Status>('commited');

		const expand = item.value.id ? treeMenu.expand(item.value.id) : ref(false);

		const onEdit = () => {
			status.value = 'editing';
		};

		const onDelete = async () => {
			await treeMenu.delete(item.value.id!);
		};

		const addNewFile = async () => {
			expand.value = true;
			await treeMenu.create('New File', false, item.value.id);
		};

		const addNewDirectory = async () => {
			expand.value = true;
			await treeMenu.create('New directory', true, item.value.id);
		};

		return {
			onEdit,
			onDelete,
			addNewFile,
			addNewDirectory,
			updateShowing,
		};
	},
});
</script>

<style css scoped></style>
