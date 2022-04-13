<template>
	<a class="tree-menu-name" v-if="status == 'commited'">{{ item.name }}</a>
	<input
		type="text"
		class="edit"
		v-model="text"
		v-else
		@keydown.enter="onEnter"
		@click="e => e.stopPropagation()"
		@focusout="onEnter"
		ref="el"
		@keydown.stop=""
		@keypress.stop=""
		@keyup.stop=""
	/>
</template>

<script lang="ts">
import { computed, defineComponent, effect, nextTick, PropType, ref, toRefs } from 'vue';
import { IEntry, useTreeMenu } from './tree';

export default defineComponent({
	props: {
		item: {
			type: Object as PropType<IEntry>,
			required: true,
		},
	},
	setup(props) {
		const { item } = toRefs(props);

		const treeMenu = useTreeMenu();

		const status = treeMenu.status(item.value.id!);

		let _name = '';

		const el = ref<HTMLInputElement>();

		const text = computed<string>({
			get: () => item.value.name ?? '',
			set: value => {
				_name = value;
			},
		});

		const onEnter = async (event: Event) => {
			if (_name != '' && _name != item.value.name) {
				await treeMenu.rename(item.value.id!, _name);
			}

			status.value = 'commited';

			event.stopPropagation();
		};

		effect(() => {
			if (status.value != 'commited') {
				nextTick(() => {
					el.value?.focus();
					el.value?.select();
				});
			}
		});

		return {
			text,
			onEnter,
			status,
			el,
		};
	},
});
</script>

<style css scoped>
.tree-menu-name {
	margin-left: 0.6em;
	flex: 1;
	text-overflow: ellipsis;
	word-break: keep-all;
	white-space: nowrap;
	overflow: hidden;
	pointer-events: none;
	color: var(--webx-primary);
}

.edit {
	margin-left: 0.5em;
	outline-style: none;
	color: var(--webx-primary);
	width: 100%;
	border: none;
	padding-inline: 0px;
	background: none;
}
</style>
