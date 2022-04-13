<template>
	<div class="form-image" :class="classes">
		<icon class="placeholder" :url="url" v-if="url"></icon>
		<a class="placeholder" v-else>{{ placeholder }}</a>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';
import Icon from '../icon/Icon.vue';
import { IAsyncReloadRef } from '../asyncref';
export default defineComponent({
	components: { Icon },
	props: {
		url: {
			type: String,
			required: false,
		},
		placeholder: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		const { url } = toRefs(props);

		const classes = computed(() => {
			if (url.value) {
				return 'form-image-selected';
			}
			return 'form-image-unselect';
		});

		return { classes };
	},
});
</script>

<style css scoped>
.form-image {
	width: 4em;
	height: 4em;
	border-radius: var(--webx-border-radius);
	cursor: pointer;
	user-select: none;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px;
	text-overflow: ellipsis;
	word-break: keep-all;
	white-space: nowrap;
	overflow: hidden;
	padding: var(--webx-padding-size);
}

.form-image-unselect {
	border: dotted 3px var(--webx-border-color);
}

.form-image-selected {
	border: solid var(--webx-border-width) var(--webx-border-color);
}

.form-image-selected:hover {
	border: solid var(--webx-border-width) var(--webx-accent);
}

.form-image-unselect:hover {
	border: dotted 3px var(--webx-accent);
}

.placeholder {
	font-size: 0.8em;
	font-weight: 300;
	color: var(--webx-secondary);
	max-width: 100%;
	max-height: 100%;
}
</style>
