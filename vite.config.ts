import vue from '@vitejs/plugin-vue';

import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'WebXUI',
			fileName: 'index',
		},
		rollupOptions: {
			external: ['vue', 'vue-router', 'vue-i18n'],
			output: {
				globals: {
					vue: 'Vue',
					'vue-router': 'vueRouter',
					'vue-i18n': 'vueI18n',
				},
			},
		},
	},
});
