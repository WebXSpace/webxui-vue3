import { Ref, ref } from 'vue';

export interface Notification {
	/// notification type
	type: 'MESSAGE' | 'ERROR' | 'WARN' | 'DEBUG';
	title?: string;
	/// notification message
	content: string;

	symbol?: symbol;
}

export interface INotificationService {
	readonly showing: Ref<Notification[]>;
	add(notification: Notification): void;
	remove(notification: Notification): void;
}

/**
 * Notification proxy
 */
export class NotificationService implements INotificationService {
	public showing = ref(new Array<Notification>());

	private _maxLength = 4;

	private _timerRunning = false;

	private _timeout = 4000;

	constructor() {}

	public add(notification: Notification) {
		notification.symbol = Symbol();
		if (this.showing.value.length < this._maxLength) {
			this.showing.value.push(notification);
		} else {
			const queue = this.showing.value.slice(1);

			queue.push(notification);

			this.showing.value = queue;
		}

		this.processTimeout();
	}

	remove(notification: Notification) {
		const array = new Array<Notification>();

		this.showing.value.forEach(it => {
			if (it != notification) {
				array.push(it);
			}
		});

		this.showing.value = array;
	}

	private processTimeout() {
		if (this._timerRunning) {
			return;
		}

		this._timerRunning = true;

		this._processTimeout();
	}

	private _processTimeout() {
		if (this.showing.value.length == 0) {
			this._timerRunning = false;
			return;
		}

		const current = this.showing.value[0];

		setTimeout(() => {
			if (this.showing.value.length > 0 && this.showing.value[0].symbol == current.symbol) {
				this.showing.value = this.showing.value.slice(1);
			}

			this._processTimeout();
		}, this._timeout);
	}
}

const _notification = new NotificationService();

export function useNotification(): INotificationService {
	return _notification;
}

export function showMessage(
	type: 'MESSAGE' | 'ERROR' | 'WARN' | 'DEBUG',
	content: string,
	title?: string,
) {
	useNotification().add({
		type,
		content,
		title,
	});
}
