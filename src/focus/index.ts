import { App, computed, DirectiveBinding, onUnmounted, onUpdated, VNode } from 'vue';

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

export function focus(app: App) {
	app.directive('focus', {
		mounted: (el: HTMLElement, binding: DirectiveBinding<string | undefined>, vnode: VNode) => {
			const htmlElement = el as HTMLElement;

			const unfocusClass = computed(() => {
				if (!binding.value) {
					return '';
				}
				return `${binding.value}-unfocus`;
			});

			const hoverClass = computed(() => {
				if (!binding.value) {
					return '';
				}
				return `${binding.value}-hover`;
			});

			const focusClass = computed(() => {
				if (!binding.value) {
					return '';
				}
				return `${binding.value}-focus`;
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
				if (focused != el && focused) {
					focused.dispatchEvent(new FocusEvent('focusout'));
				}

				focused = el;

				focusin(event);
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
