export interface LocaleMessages {
	[key: string]: string;
}

export interface I18n {
	default: string;
	messages: { [key: string]: LocaleMessages };
}

let _i18n: I18n | undefined;

export function createI18n(i18n: I18n) {
	_i18n = i18n;
}

export function t(name: string, options?: { [key: string]: string }): string {
	if (!_i18n) {
		throw new Error('call createI18n first');
	}

	let language = new Intl.Locale(navigator.language).language ?? _i18n.default;

	let messages = _i18n.messages[language];

	if (!messages) {
		if (language == _i18n.default) {
			return name;
		}

		language = _i18n.default;

		messages = _i18n.messages[language];
	}

	if (!messages) {
		return name;
	}

	let localMessage = messages[name];

	if (!localMessage) {
		if (language == _i18n.default) {
			return name;
		}

		language = _i18n.default;

		messages = _i18n.messages[language];

		localMessage = messages[name];
	}

	if (!localMessage) {
		return name;
	}

	return localMessage.replace(/{([a-zA-Z][a-zA-Z0-9]+)}/gm, (match, group) => {
		if (options && options[group]) {
			return options[group];
		}

		return match;
	});
}
