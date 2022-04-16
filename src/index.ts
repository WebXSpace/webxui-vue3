import { App } from 'vue';
import { focus } from './focus';

import './assets/style.css';

export * from './color';
export * from './app';
export * from './icon';
export * from './menu';
export * from './button';
export * from './input';
export * from './tooltip';
export * from './focus';
export * from './dialog';
export * from './device';
export * from './form';
export * from './asyncref';
export * from './notification';
export * from './loading';
export * from './i18n';

import { VueClipboard } from '@soerenmartius/vue3-clipboard';

export interface Operation {}

export function webxui(app: App, operation?: Operation) {
	app.use(focus);
	app.use(VueClipboard);
}
