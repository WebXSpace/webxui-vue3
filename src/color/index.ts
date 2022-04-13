import { ref, Ref } from 'vue';

function hashCode(str: string) {
	// java String#hashCode
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	return hash;
}

function intToRGB(i: number) {
	var c = (i & 0x00ffffff).toString(16).toUpperCase();

	return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export function randomColor(seed: string): string {
	return intToRGB(hashCode(seed));
}

export type ColorScheme = 'dark' | 'light';

const _colorScheme = ref<ColorScheme>('light');

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
	if (event.matches) {
		_colorScheme.value = 'dark';
	} else {
		_colorScheme.value = 'light';
	}
});

export function useColorScheme(): Ref<ColorScheme> {
	return _colorScheme;
}
