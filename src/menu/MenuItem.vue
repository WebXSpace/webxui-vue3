<template>
	<div class="menu-item" @click="click">
		{{ name }}
		<icon :name="icon" v-if="icon" class="menu-item-icon" color="var(--webx-secondary)"></icon>
	</div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onUnmounted, toRefs } from 'vue';

import Icon from '../icon/Icon.vue';
import { mountMenu, unmountMenu } from './menu';

export default defineComponent({
	props: {
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			require: false,
		},
	},
	setup(props) {
		const instance = getCurrentInstance()!;
		const { name } = toRefs(props);

		const menu = mountMenu(instance, name.value.toLocaleLowerCase());

		onUnmounted(() => {
			unmountMenu(instance);
		});

		const click = () => {
			menu.menuGroup.onclick(menu.path, false);
		};

		return {
			click,
		};
	},
	components: { Icon },
});
</script>

<style css scoped>
.menu-item {
	padding-inline: var(--webx-padding-size);
	padding-block: calc(var(--webx-padding-size) / 2);
	font-weight: 300;
	font-size: 0.8em;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: var(--webx-primary);
	border-radius: calc(var(--webx-border-radius) / 2);
}

.menu-item:hover {
	background-color: var(--webx-shadow-color);
}

.menu-item-icon {
	width: 1.2em;
	height: 1.2em;
}
</style>
