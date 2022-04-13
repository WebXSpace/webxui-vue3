<template>
	<div class="app-frame">
		<teleport to="body" v-if="!isMacOS">
			<div class="app-frame-sysbar">
				<div class="app-frame-sysbar-buttons">
					<div
						class="app-frame-sysbar-button app-frame-sysbar-close-button"
						@click="close"
					>
						<icon name="close" class="app-frame-sysbar-icon"></icon>
					</div>

					<div class="app-frame-sysbar-button" @click="maximize" v-if="resizable">
						<icon name="maximize" class="app-frame-sysbar-icon"></icon>
					</div>

					<div class="app-frame-sysbar-button" @click="minimize">
						<icon name="minimize" class="app-frame-sysbar-icon"></icon>
					</div>
				</div>
			</div>
		</teleport>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Icon } from '../icon';
import { useAppProvider } from './app';
export default defineComponent({
	components: {
		Icon,
	},
	setup() {
		const appProvider = useAppProvider();

		const close = async () => {
			await appProvider.close();
		};

		const maximize = async () => {
			await appProvider.maximizeOrNormalmize();
		};

		const minimize = async () => {
			await appProvider.minimize();
		};

		return {
			close,
			maximize,
			minimize,
			isMacOS: appProvider.isMacOS,
			resizable: appProvider.resizable,
		};
	},
});
</script>

<style css scoped>
.app-frame {
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}

.app-frame-sysbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: var(--webx-app-frame-sysbar-height);
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	pointer-events: none;
}

.app-frame-sysbar-buttons {
	height: 100%;
	width: fit-content;
	display: flex;
	flex-direction: row-reverse;
}
.app-frame-sysbar-button {
	height: 100%;
	display: flex;
	align-items: center;
	padding-inline: 1em;
	-webkit-app-region: no-drag;
	pointer-events: all;
}

.app-frame-sysbar-button:hover {
	background-color: var(--webx-shadow-color);
}

.app-frame-sysbar-close-button:hover {
	background-color: var(--webx-danger);
}

.app-frame-sysbar-icon {
	width: 0.7em;
	height: 0.7em;
}
</style>
