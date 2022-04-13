<template>
	<group :item="item" :depth="depth" v-if="item && item.isGroup">
		<template v-slot="{ children }">
			<Entry :id="item" :depth="depth + 1" v-for="item in children"></Entry>
		</template>
	</group>
	<file :item="item" :depth="depth" v-if="item && !item.isGroup"></file>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, toRefs } from 'vue';
import Group from './Group.vue';
import File from './File.vue';
import { IEntry, useTreeMenu } from './tree';
export default defineComponent({
	components: {
		Group,
		File,
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		depth: {
			type: Number,
			required: true,
		},
	},
	setup(props) {
		const { id } = toRefs(props);

		const treeMenu = useTreeMenu();

		const item = treeMenu.entry(id.value);

		onMounted(async () => {
			await item.reload();
		});

		return {
			item: item.value,
		};
	},
});
</script>

<style css scoped>
.tree-menu-entry {
}
</style>
