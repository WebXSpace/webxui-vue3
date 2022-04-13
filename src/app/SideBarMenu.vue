<template>
	<div class="side-bar-menu" :class="classes" @click="click">
		<tool-tip :content="desc" :direction="'right'" :margin="24">
			<icon
				:name="icon"
				:color="color"
				class="icon"
				@mouseover="mouseover"
				@mouseleave="mouseleave"
			>
			</icon>
		</tool-tip>
	</div>
</template>

<script lang="ts">
import {
	defineComponent,
	getCurrentInstance,
	onUnmounted,
	PropType,
	ref,
	toRefs,
	watch,
} from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';
import { mountMenu, unmountMenu } from '../menu';
import { Icon } from '../icon';
import ToolTip from '../tooltip/ToolTip.vue';

export default defineComponent({
	components: {
		Icon,
		ToolTip,
	},
	props: {
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			default: '',
		},
		to: {
			type: Object as PropType<RouteLocationRaw>,
			required: true,
		},
	},
	setup(props) {
		const instance = getCurrentInstance()!;
		const { name, to } = toRefs(props);
		const menu = mountMenu(instance, name.value.toLocaleLowerCase());

		onUnmounted(() => {
			unmountMenu(instance);
		});

		const selected = menu.menuGroup.selected;

		const mouseenter = ref(false);

		const router = useRouter();

		const classes = ref('side-bar-menu-unselected');

		const color = ref('var(--webx-secondary)');

		watch(
			selected,
			current => {
				if (current == menu.path) {
					if (router.currentRoute.value.name != to.value) {
						router.push(to.value);
					}

					classes.value = 'side-bar-menu-selected';
					color.value = 'var(--webx-primary)';
				} else {
					classes.value = 'side-bar-menu-unselected';
					color.value = 'var(--webx-secondary)';
				}
			},
			{ immediate: true },
		);

		watch(mouseenter, flag => {
			if (menu.path != selected.value) {
				if (flag) {
					color.value = 'var(--webx-primary)';
				} else {
					color.value = 'var(--webx-secondary)';
				}
			}
		});

		const click = () => {
			menu.menuGroup.select(menu.path);
		};

		const mouseover = () => {
			mouseenter.value = true;
		};

		const mouseleave = () => {
			mouseenter.value = false;
		};

		return {
			color,
			classes,
			mouseover,
			mouseleave,
			selected,
			click,
		};
	},
});
</script>

<style css scoped>
.side-bar-menu {
	width: calc(100% - 2 * var(--webx-border-accent-width));
	height: fit-content;
	display: flex;
	justify-content: center;
	user-select: none;
	cursor: pointer;
	-webkit-app-region: no-drag;
	border-left: solid var(--webx-border-accent-width) transparent;
	border-right: solid var(--webx-border-accent-width) transparent;
	padding-block: var(--webx-padding-size);
}

.side-bar-menu-selected {
	border-left: solid var(--webx-border-accent-width) var(--webx-accent);
}

.icon {
	width: 1.5em;
	height: 1.5em;
}
</style>
