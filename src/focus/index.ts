import { App, computed, DirectiveBinding, onUnmounted, onUpdated, Ref, VNode } from 'vue';

let focusables: HTMLElement[] = [];

let focused: HTMLElement | undefined;

window.addEventListener('keydown', (event: KeyboardEvent) => {
	if (focused && event.target != focused) {
		focused?.dispatchEvent(new KeyboardEvent(event.type, event));
	}
});

window.addEventListener('keypress', (event: KeyboardEvent) => {
	if (focused && event.target != focused) {
		focused?.dispatchEvent(new KeyboardEvent(event.type, event));
	}
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
	if (focused && event.target != focused) {
		focused?.dispatchEvent(new KeyboardEvent(event.type, event));
	}
});

export type FocusStatus = 'unfocus' | 'focus' | 'hover';

export interface FocusBinding {
	name?: string;
	status: (status: FocusStatus) => void;
}

export function focus(app: App) {
	app.directive('focus', {
		mounted: (
			el: HTMLElement,
			binding: DirectiveBinding<FocusBinding | string | undefined>,
			vnode: VNode,
		) => {
			let name: string | undefined;

			let status: (status: FocusStatus) => void | undefined;

			if (typeof binding.value == 'string') {
				name = binding.value;
			} else if (typeof binding.value == 'object') {
				name = binding.value.name;
				status = binding.value.status;
			}

			const htmlElement = el as HTMLElement;

			const unfocusClass = computed(() => {
				if (!name) {
					return '';
				}
				return `${name}-unfocus`;
			});

			const hoverClass = computed(() => {
				if (!name) {
					return '';
				}
				return `${name}-hover`;
			});

			const focusClass = computed(() => {
				if (!name) {
					return '';
				}
				return `${name}-focus`;
			});

			if (unfocusClass.value && !htmlElement.classList.contains(unfocusClass.value)) {
				htmlElement.classList.add(unfocusClass.value);
			}

			const mouseover = (event: Event) => {
				if (focused == el) {
					return;
				}

				if (unfocusClass.value && htmlElement.classList.contains(unfocusClass.value)) {
					htmlElement.classList.remove(unfocusClass.value);
				}

				if (hoverClass.value) {
					htmlElement.classList.add(hoverClass.value);
				}

				if (status) {
					status('hover');
				}

				event.stopPropagation();
			};

			const mouseleave = (event: Event) => {
				if (focused == el) {
					return;
				}

				if (hoverClass.value && htmlElement.classList.contains(hoverClass.value)) {
					htmlElement.classList.remove(hoverClass.value);
				}

				if (unfocusClass.value) {
					htmlElement.classList.add(unfocusClass.value);
				}

				if (status) {
					status('unfocus');
				}

				event.stopPropagation();
			};

			const focusin = (event: Event) => {
				if (unfocusClass.value && htmlElement.classList.contains(unfocusClass.value)) {
					htmlElement.classList.remove(unfocusClass.value);
				}

				if (focusClass.value) {
					htmlElement.classList.add(focusClass.value);
				}

				if (focused != el && focused) {
					focused.dispatchEvent(new FocusEvent('focusout'));
				}

				focused = el;

				if (status) {
					status('focus');
				}

				event.stopPropagation();
			};

			const focusout = (event: Event) => {
				if (focusClass.value && htmlElement.classList.contains(focusClass.value)) {
					htmlElement.classList.remove(focusClass.value);
				}

				if (hoverClass.value && htmlElement.classList.contains(hoverClass.value)) {
					htmlElement.classList.remove(hoverClass.value);
				}

				if (unfocusClass.value) {
					htmlElement.classList.add(unfocusClass.value);
				}

				if (focused == el) {
					focused = undefined;
				}

				if (status) {
					status('unfocus');
				}

				event.stopPropagation();
			};

			const inputs = htmlElement.querySelectorAll('input');

			inputs.forEach(it => {
				it.addEventListener('focusin', focusin);
				it.addEventListener('focusout', focusout);
			});

			htmlElement.addEventListener('focusin', focusin);
			htmlElement.addEventListener('focusout', focusout);
			htmlElement.addEventListener('mouseover', mouseover);
			htmlElement.addEventListener('mouseleave', mouseleave);
			htmlElement.addEventListener('click', event => {
				focusin(event);
				event.stopPropagation();
			});

			focusables = focusables.filter(it => {
				return it != el;
			});

			focusables.push(el);
		},
		unmounted: (el: HTMLElement, binding: DirectiveBinding<string>) => {
			focusables = focusables.filter(it => {
				return it != el;
			});

			if (focused == el) {
				focused = undefined;
			}
		},
	});
}
