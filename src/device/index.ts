import { ref, Ref } from 'vue';
import debounce from 'debounce';

export type Device = 'PC' | 'MOBILE' | 'PAD';

let _device: Ref<Device>;

function __checkDeviceDimension(): Device {
	if (window.innerWidth > 1200) {
		return 'PC';
	}

	if (window.innerWidth > 600) {
		return 'PAD';
	}

	return 'MOBILE';
}

export function useDevice(): Ref<Device> {
	if (!_device) {
		_device = ref(__checkDeviceDimension());

		window.addEventListener(
			'resize',
			debounce(() => {
				_device!.value = __checkDeviceDimension();
			}, 16),
		);
	}

	return _device;
}
