<template>
	<div class="pop-menu" @click="onClick" ref="from">
		<slot>
			<div class="button">{{ text }}</div>
		</slot>

		<context-menu :width="width" :x="x" :y="y" v-model:showing="showing">
			<slot name="menus"></slot>
		</context-menu>
	</div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, nextTick, ref } from 'vue';
import { popupRect } from '../popup';
import ContextMenu from './ContextMenu.vue';

export default defineComponent({
	props: {
		text: {
			type: String,
			default: '',
		},
		width: {
			type: String,
			default: '200px',
		},
	},
	components: {
		ContextMenu,
	},
	setup() {
		const showing = ref(false);

		const x = ref(0);

		const y = ref(0);

		const onClick = () => {
			showing.value = !showing.value;

			const fromRect = from.value?.getBoundingClientRect() ?? new DOMRect(0, 0);

			x.value = fromRect.left;
			y.value = fromRect.bottom;
		};

		const from = ref<HTMLElement>();

		return { x, y, from, showing, onClick };
	},
});
</script>

<style css scoped>
.pop-menu {
	width: fit-content;
	height: fit-content;
}

.button {
	font-weight: 600;
	font-size: 0.8em;
}
</style>
