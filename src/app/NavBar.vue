<template>
	<div class="app-nav-bar">
		<IconButton class="button" name="arrow-left" @click="goback"></IconButton>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import IconButton from '../button/IconButton.vue';

export default defineComponent({
	components: { IconButton },
	setup() {
		const router = useRouter();

		const goback = () => {
			router.back();
		};

		return {
			goback,
		};
	},
});
</script>

<style css scoped>
.app-nav-bar {
	height: var(--webx-app-frame-sysbar-height);
	width: calc(100% - 2 * var(--webx-padding-size));
	padding: var(--webx-padding-size);
	display: flex;
	align-items: center;
}

.button {
	width: 1.2em;
	height: 1.2em;
}
</style>
