<template>
	<div class="link" @click="click">
		<slot name="header">
			<icon name="link" class="link-icon"></icon>
		</slot>
		<slot> {{ text }} </slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';
import { Icon } from '../icon';
export default defineComponent({
	components: {
		Icon,
	},
	props: {
		href: {
			type: String,
			default: '',
		},
		to: {
			type: Object as PropType<RouteLocationRaw>,
			required: false,
		},
		blank: {
			type: Boolean,
			default: true,
		},
		icon: {
			type: String,
			default: 'link',
		},
		text: {
			type: String,
			default: '',
		},
	},
	emits: ['navigate'],
	setup(props, { emit }) {
		const { href, to, blank } = toRefs(props);

		if (href.value == '' && to.value == undefined) {
			throw new Error('expect set href or to attribute');
		}

		const router = useRouter();

		const click = () => {
			if (href.value) {
				if (blank.value) {
					let strWindowFeatures =
						'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
					window.open(href.value, '_blank', strWindowFeatures);
				} else {
					window.location.href = href.value;
				}
			} else {
				router.push(to.value!);
			}

			emit('navigate');
		};

		return {
			click,
		};
	},
});
</script>

<style css scoped>
.link {
	display: flex;
	align-items: center;
	cursor: pointer;
	user-select: none;
	border-bottom: solid var(--webx-border-width) transparent;
}

.link:hover {
	border-bottom: solid var(--webx-border-width) var(--webx-border-color);
}
.link-icon {
	min-width: 1em;
	min-height: 1em;
	max-width: 1em;
	max-height: 1em;
	margin-right: 0.5em;
}
</style>
