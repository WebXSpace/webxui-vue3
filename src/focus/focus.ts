import { App, computed, DirectiveBinding, effect, readonly, Ref, ref, watch } from 'vue';
import { debounce } from 'throttle-debounce';
/**
 * Global focusable object map
 */
const _focusables = new Map<HTMLElement, Focusable>();

/**
 * current focused element reactive object
 */
const _focusedELement = ref<HTMLElement>();

/**
 * HTMLElement focus status object
 */
class Focusable {
	/// focus target html element name
	private _name?: string;
	/// status listener function
	private _statusListener?: FocusStatusChanged;
	/// status object hold target element
	private _element: HTMLElement;

	/**
	 * Create new focusable oject
	 * @param el target html element
	 */
	constructor(el: HTMLElement, name?: string, listener?: FocusStatusChanged) {
		this._element = el;

		this._name = name;

		this._statusListener = listener;

		const inputs = el.querySelectorAll('input');

		inputs.forEach(it => {
			it.addEventListener('focusin', e => {
				this._onFocusIn(e);
			});

			it.addEventListener('focusout', e => {
				this._onFocusOut(e);
			});
		});

		el.addEventListener('focusin', e => {
			_focusedELement.value = this._element;
			e.stopPropagation();
		});

		el.addEventListener('focusout', e => {
			_focusedELement.value = undefined;
			e.stopPropagation();
		});

		const debounceOnMouseOver = debounce(100, true, (event: Event) => {
			this._onMouseOver(event);
		});

		el.addEventListener('mouseover', e => {
			debounceOnMouseOver(e);
		});

		el.addEventListener('mouseleave', e => {
			this._onMouseLeave(e);
		});

		el.addEventListener('click', e => {
			_focusedELement.value = this._element;
			e.stopPropagation();
		});

		el.addEventListener('keydown', e => {
			if (e.key == 'Escape') {
				_focusedELement.value = undefined;
			}
		});

		this._changeClasses('unfocus');
	}

	/**
	 * Set new name
	 * @param name
	 */
	public updateName(name?: string) {
		this._name = name;
	}

	/**
	 * Set new listener
	 * @param listener
	 */
	public updateStatusListener(listener: FocusStatusChanged) {
		this._statusListener = listener;
	}

	/**
	 * unfocus class
	 */
	private get unfocusClass(): string | undefined {
		return this._className('unfocus');
	}

	/**
	 * focus class
	 */
	private get focusClass(): string | undefined {
		return this._className('focus');
	}

	/**
	 * hover class
	 */
	private get hoverClass(): string | undefined {
		return this._className('hover');
	}

	/**
	 * Get status class name
	 * @param status FocusStatus
	 * @returns class name string, or undefined
	 */
	private _className(status: FocusStatus): string | undefined {
		if (!this._name) {
			return undefined;
		}

		return `${this._name}-${status}`;
	}

	private get focused(): boolean {
		return _focusedELement.value == this._element;
	}

	private emitStatusEvent(status: FocusStatus) {
		if (this._statusListener) {
			this._statusListener(status);
		}
	}

	private _changeClasses(status: FocusStatus) {
		['focus', 'unfocus', 'hover'].forEach(it => {
			const className = this._className(it as FocusStatus);
			if (className && this._element.classList.contains(className)) {
				this._element.classList.remove(className);
			}
		});

		const className = this._className(status);

		if (className) {
			this._element.classList.add(className);
		}
	}

	private _onMouseOver(event: Event) {
		event.stopPropagation();

		/// skip if focused
		if (this.focused) {
			return;
		}

		this._changeClasses('hover');

		this.emitStatusEvent('hover');
	}

	private _onMouseLeave(event: Event) {
		event.stopPropagation();

		if (this.focused) {
			this._changeClasses('focus');
			this.emitStatusEvent('focus');
		} else {
			this._changeClasses('unfocus');
			this.emitStatusEvent('unfocus');
		}
	}

	/**
	 * manual focus element
	 */
	public focus() {
		this._onFocusIn();
	}

	public unfocus() {
		this._onFocusOut();
	}

	private _onFocusIn(event?: Event) {
		this._changeClasses('focus');

		this.emitStatusEvent('focus');

		event?.stopPropagation();
	}

	private _onFocusOut(event?: Event) {
		this._changeClasses('unfocus');

		this.emitStatusEvent('unfocus');

		event?.stopPropagation();
	}
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
	if (_focusedELement.value && event.target != _focusedELement.value) {
		_focusedELement.value?.dispatchEvent(new KeyboardEvent(event.type, event));
	}
});

window.addEventListener('keypress', (event: KeyboardEvent) => {
	if (_focusedELement.value && event.target != _focusedELement.value) {
		_focusedELement.value?.dispatchEvent(new KeyboardEvent(event.type, event));
	}
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
	if (_focusedELement.value && event.target != _focusedELement.value) {
		_focusedELement.value?.dispatchEvent(new KeyboardEvent(event.type, event));
	}
});

/**
 * Focus status enum
 */
export type FocusStatus = 'unfocus' | 'focus' | 'hover';

/**
 * Focus directive binding value
 */
export type FocusStatusChanged = (status: FocusStatus) => void;

/**
 * Get current focused element or return undefined if nothing focused.
 * @returns HTMLElement ref object
 */
export function useFocusedElement(): Ref<HTMLElement | undefined> {
	return _focusedELement;
}

watch(_focusedELement, (newElement, oldElement) => {
	if (oldElement) {
		const currentFocusable = _focusables.get(oldElement);

		if (currentFocusable) {
			currentFocusable.unfocus();
		}
	}

	if (newElement) {
		const newFocusable = _focusables.get(newElement);

		console.log('old', newElement, newFocusable);

		if (newFocusable) {
			newFocusable.focus();
		}
	}
});

/**
 * Register v-focus directive
 * @param app Vue instance
 */
export function installFocusDirective(app: App) {
	app.directive('focus', {
		mounted: (el: HTMLElement, binding: DirectiveBinding<FocusStatusChanged | undefined>) => {
			const focusable = new Focusable(el, binding.arg, binding.value);

			_focusables.set(el, focusable);
		},
		unmounted: (el: HTMLElement) => {
			_focusables.delete(el);
		},
	});
}
