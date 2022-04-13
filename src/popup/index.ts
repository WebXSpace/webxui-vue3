import { Component, createApp, Plugin } from 'vue';

export type Orientation = 'top' | 'right' | 'bottom' | 'left';

export interface Position {
	top?: string;
	left?: string;
	right?: string;
	bottom?: string;
}

export type Direction =
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'
	| 'leftTop'
	| 'leftBottom'
	| 'rightTop'
	| 'rightBottom'
	| 'bottomRight'
	| 'bottomLeft';

export interface PopupRect {
	top: string;
	left: string;
	right: string;
	bottom: string;
}

export function popupRect(
	fromRect: DOMRect,
	toRect: DOMRect,
	direction: Direction,
	margin: number,
): DOMRect {
	const width = toRect.width;

	const height = toRect.height;

	let x = fromRect.x;
	let y = fromRect.y;

	switch (direction) {
		case 'left': {
			x = x - width - margin;
			y = y + Math.floor(fromRect.height / 2) - height;
			break;
		}
		case 'leftTop': {
			x = x - width - margin;
			y = y - height - margin;
			break;
		}
		case 'top': {
			x = x + Math.floor(fromRect.width / 2) - width / 2;
			y -= height - margin;
			break;
		}
		case 'rightTop': {
			x += fromRect.width + margin;
			y -= height - margin;
			break;
		}
		case 'right': {
			x += fromRect.width + margin;
			y = y + Math.floor(fromRect.height / 2) - height / 2;
			break;
		}
		case 'rightBottom': {
			x += fromRect.width + margin;
			y += fromRect.height + margin;
			break;
		}
		case 'bottomRight': {
			x += fromRect.width - width;
			y += fromRect.height + margin;
			break;
		}
		case 'bottom': {
			x = x + Math.floor(fromRect.width / 2) - width / 2;
			y += fromRect.height;
			break;
		}
		case 'leftBottom': {
			x -= width;
			y += fromRect.height + margin;
			break;
		}
		case 'bottomLeft': {
			y += fromRect.height + margin;
			break;
		}
	}

	if (x + width > window.innerWidth) {
		x = window.innerWidth - width;
	}

	if (x < 0) {
		x = 0;
	}

	if (y + height > window.innerHeight) {
		y = window.innerHeight - height;
	}

	if (y < 0) {
		y = 0;
	}

	const rect = new DOMRect(x, y, width, height);

	// console.log('from', fromRect, 'to', toRect, 'popuRect', rect);

	return rect;
}
