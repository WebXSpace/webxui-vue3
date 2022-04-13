<template>
	<teleport to="body">
		<div class="notification" v-if="showing">
			<transition-group
				name="custom-classes-transition"
				enter-active-class="animate__animated animate__slideInRight"
				leave-active-class="animate__animated animate__slideOutRight"
			>
				<div class="message" v-for="item in queue" @click="click(item)" :key="item.symbol!">
					<icon :name="icon(item)" class="icon" :color="color(item)"></icon>
					<div class="text">
						<a class="title">{{ item.title }}</a>
						<a class="content">{{ item.content }}</a>
					</div>
				</div>
			</transition-group>
		</div>
	</teleport>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useNotification, Notification } from './notification';
import { Icon } from '../icon';

export default defineComponent({
	components: {
		Icon,
	},
	setup() {
		const service = useNotification();

		const showing = computed(() => {
			return service.showing.value.length > 0;
		});

		const icon = (notification: Notification) => {
			return notification.type.toLocaleLowerCase();
		};

		const color = (notification: Notification) => {
			return `var(--webx-${notification.type.toLocaleLowerCase()})`;
		};

		const click = (notification: Notification) => {
			service.remove(notification);
		};

		return {
			click,
			color,
			icon,
			showing,
			queue: service.showing,
		};
	},
});
</script>
<style css scoped>
.notification {
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	position: fixed;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	z-index: 10000;
	pointer-events: none;
}

.message {
	pointer-events: all;
	width: 400px;
	border: solid var(--webx-border-secondary-width) var(--webx-accent);
	border-radius: var(--webx-border-radius);
	box-shadow: 0 0px 12px var(--webx-accent);
	padding: var(--webx-padding-size);
	margin: var(--webx-padding-size);
	background-color: var(--webx-background);
	display: flex;
	align-items: center;
	min-height: 2em;
	cursor: pointer;
	user-select: none;
}

@media (max-width: 600px) {
	.message {
		width: calc(100% - 4 * var(--webx-padding-size));
	}

	.notification {
		align-items: center;
	}
}

.icon {
	width: 3em;
	height: 3em;
	margin-right: 0.5em;
}

.content {
	font-size: 1em;
	color: var(--webx-primary);
	font-weight: 300;
}

.text {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.title {
	font-weight: bold;
}
</style>
