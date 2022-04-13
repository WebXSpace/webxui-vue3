import { ref, Ref, UnwrapRef } from 'vue';

export interface IAsyncRef<T> {
	readonly value: Ref<UnwrapRef<T> | undefined>;
	readonly loading: Ref<boolean>;
	readonly error: Ref<Error | undefined>;
}

export interface IAsyncReloadRef<T> extends IAsyncRef<T> {
	/// Reload value
	reload(): Promise<void>;
}

class AsyncRef<T> implements IAsyncReloadRef<T> {
	value: Ref<UnwrapRef<T> | undefined>;

	loading: Ref<boolean> = ref(false);

	error: Ref<Error | undefined> = ref();

	_fn: () => Promise<UnwrapRef<T> | undefined>;

	constructor(fn: () => Promise<UnwrapRef<T> | undefined>, defaultValue?: T) {
		this._fn = fn;
		this.value = ref(defaultValue);
	}

	async reload(): Promise<void> {
		try {
			this.loading.value = true;

			this.value.value = undefined;
			this.value.value = await this._fn();
		} catch (error: any) {
			console.log(this.error.value);
			// this.error.value = error;
		}

		this.loading.value = false;
	}
}

export function asyncRef<T>(
	fn: () => Promise<UnwrapRef<T> | undefined>,
	defaultValue?: T,
): IAsyncReloadRef<T> {
	return new AsyncRef(fn, defaultValue);
}
