import { inject, provide, Ref } from 'vue';

export interface IAppProvider {
	readonly maximized: Ref<boolean>;

	readonly resizable: Ref<boolean>;

	readonly isMacOS: Ref<boolean>;

	minimize(): Promise<void>;

	maximizeOrNormalmize(): Promise<void>;

	close(): Promise<void>;
}

const _appProviderKey = Symbol();

export function useAppProvider(): IAppProvider {
	return inject(_appProviderKey)!;
}

export function setupAppProvider(provider: IAppProvider) {
	provide(_appProviderKey, provider);
}
