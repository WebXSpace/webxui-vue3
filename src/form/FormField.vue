<template>
	<div class="form-filed-border">
		<slot name="header"></slot>
		<div class="form-field">
			<a class="name">{{ name }}</a>
			<slot></slot>
		</div>

		<slot name="footer"></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		name: {
			type: String,
			required: true,
		},
	},
	setup() {},
});
</script>

<style css scoped>
.form-filed-border {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-block: var(--webx-padding-size);
}

.form-field {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-items: center;
	user-select: none;
	width: 100%;
}

.name {
	font-size: 0.8em;
	font-weight: 600;
	padding-right: 1em;
	color: var(--webx-primary);
}
</style>
