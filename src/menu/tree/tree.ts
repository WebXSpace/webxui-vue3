import { inject, provide, ref, Ref } from 'vue';

import { asyncRef, IAsyncReloadRef } from '../../asyncref';

export type Status = 'editing' | 'pre-add' | 'commited';

export interface IEntry {
	readonly id?: string;
	readonly name?: string;
	readonly groupId?: string;
	readonly isGroup: boolean;
	readonly readonly?: boolean;
}

export interface ITreeMenuProvider {
	/// create new entry
	create(name: string, isGroup: boolean, groupId?: string): Promise<string>;
	/// delete entry by id
	delete(id: string): Promise<void>;
	/// rename entry by id
	rename(id: string, name: string): Promise<void>;
	/// move entry
	move(id: string, groupId?: string): Promise<void>;
	/// get entry children by id or get root group children
	children(id?: string): Promise<string[]>;
	/// Get entry id by name and path
	id(name: string, isGroup: boolean, groupId?: string): Promise<string | undefined>;
	/// Get entry information by id
	entry(id: string): Promise<IEntry>;
}

export class TreeMenu {
	private readonly _provider: ITreeMenuProvider;

	private readonly _children = new Map<string, IAsyncReloadRef<string[]>>();

	private readonly _rootChildren: IAsyncReloadRef<string[]>;

	private readonly _entries = new Map<string, IAsyncReloadRef<IEntry>>();

	private readonly _expands = new Map<string, Ref<boolean>>();

	private readonly _status = new Map<string, Ref<Status>>();

	private readonly _dragOver = new Map<string, Ref<number>>();

	private readonly _rootDragOver = ref(0);

	private readonly _rootEntry = asyncRef<IEntry>(
		async () => {
			return {
				isGroup: true,
				readonly: true,
			};
		},
		{
			isGroup: true,
			readonly: true,
		},
	);

	/**
	 * Drag entry id
	 */
	public readonly dragItem = ref<string[]>();

	/// current selected entry
	public readonly selected = ref<string[]>();
	/// focused entry id
	public readonly focused = ref<string>();

	constructor(provider: ITreeMenuProvider) {
		this._provider = provider;
		this._rootChildren = asyncRef(async () => {
			return await provider.children();
		}, []);
	}

	children(id?: string): IAsyncReloadRef<string[]> {
		let rx: IAsyncReloadRef<string[]> | undefined;
		if (!id) {
			rx = this._rootChildren;
		} else {
			rx = this._children.get(id);
			if (!rx) {
				rx = asyncRef(async () => {
					return await this._provider.children(id);
				});
				this._children.set(id, rx);
			}
		}

		return rx;
	}

	entry(id?: string): IAsyncReloadRef<IEntry> {
		if (!id) {
			return this._rootEntry;
		}

		let rx: IAsyncReloadRef<IEntry> | undefined;

		rx = this._entries.get(id);

		if (!rx) {
			rx = asyncRef(async () => {
				return await this._provider.entry(id);
			});

			this._entries.set(id, rx);
		}

		return rx;
	}

	dragOver(id?: string): Ref<number> {
		if (!id) {
			return this._rootDragOver;
		}

		let rx = this._dragOver.get(id);

		if (!rx) {
			rx = ref(0);
			this._dragOver.set(id, rx);
		}

		return rx;
	}

	expand(id: string): Ref<boolean> {
		let rx = this._expands.get(id);

		if (!rx) {
			rx = ref(false);
			this._expands.set(id, rx);
		}

		return rx;
	}

	status(id: string): Ref<Status> {
		let rx = this._status.get(id);

		if (!rx) {
			rx = ref('commited');
			this._status.set(id, rx);
		}

		return rx;
	}

	async create(name: string, isGroup: boolean, groupId?: string): Promise<string> {
		const id = await this._provider.create(name, isGroup, groupId);
		// refresh group children
		await this.children(groupId).reload();

		this.status(id).value = 'editing';

		return id;
	}

	async rename(id: string, name: string) {
		await this._provider.rename(id, name);

		const rx = this.entry(id);

		await rx.reload();

		await this.children(rx.value.value?.groupId).reload();
	}

	async move(id: string, groupId?: string) {
		const rx = this.entry(id);

		await rx.reload();

		const source = rx.value.value?.groupId;

		if (source == groupId) {
			return;
		}

		await this._provider.move(id, groupId);

		await this.children(source).reload();

		await this.children(groupId).reload();
	}

	async delete(id: string) {
		const rx = this.entry(id);

		await rx.reload();

		await this._provider.delete(id);

		await this._delete(id);

		await this.children(rx.value.value!.groupId).reload();
	}

	async _delete(id: string) {
		this._entries.delete(id);

		this._expands.delete(id);

		this._dragOver.delete(id);

		this._status.delete(id);

		const children = this._children.get(id);

		this._children.delete(id);

		if (!children || !children.value.value) {
			return;
		}

		for (const i in children.value.value) {
			await this._delete(children.value.value[i]);
		}
	}
}

const _symbol = Symbol();

/**
 * in parent component setup call this function to initialize tree menu
 */
export function provideTreeMenu(provider: ITreeMenuProvider) {
	provide(_symbol, new TreeMenu(provider));
}

/**
 * Call by tree menu inner component
 */
export function useTreeMenu(): TreeMenu {
	let treeMenu = inject<TreeMenu>(_symbol);

	if (!treeMenu) {
		throw new Error('call provideTreeMenu first');
	}

	return treeMenu;
}

async function _dragEnter(menu: TreeMenu, to: IEntry) {
	if (to.isGroup) {
		menu.dragOver(to.id).value += 1;

		if (menu.expand(to.id!).value) {
			const children = menu.children(to.id);

			if (!children.value.value) {
				await children.reload();
			}

			for (let idx in children.value.value!) {
				const child = children.value.value[idx];

				let entry = menu.entry(child);

				if (!entry.value.value) {
					await entry.reload();
				}

				if (entry.value.value!.isGroup) {
					await _dragEnter(menu, entry.value.value!);
				} else {
					menu.dragOver(entry.value.value!.id).value += 1;
				}
			}
		}
	} else {
		let entry: IEntry = { id: '', name: '', isGroup: true };

		if (to.groupId) {
			const rx = menu.entry(to.groupId);

			if (!rx.value.value) {
				await rx.reload();
			}

			entry = rx.value.value!;
		}

		await _dragEnter(menu, entry);
	}
}

async function _dragLeave(menu: TreeMenu, to: IEntry) {
	if (to.isGroup) {
		menu.dragOver(to.id).value -= 1;

		if (menu.expand(to.id!).value) {
			const children = menu.children(to.id);

			if (!children.value.value) {
				await children.reload();
			}

			for (let idx in children.value.value!) {
				const child = children.value.value[idx];

				let entry = menu.entry(child);

				if (!entry.value.value) {
					await entry.reload();
				}

				if (entry.value.value!.isGroup) {
					await _dragLeave(menu, entry.value.value!);
				} else {
					menu.dragOver(entry.value.value!.id).value -= 1;
				}
			}
		}
	} else {
		let entry: IEntry = { id: '', name: '', isGroup: true };

		if (to.groupId) {
			const rx = menu.entry(to.groupId);

			if (!rx.value.value) {
				await rx.reload();
			}

			entry = rx.value.value!;
		}

		await _dragLeave(menu, entry);
	}
}

async function _dropable(menu: TreeMenu, to: IEntry): Promise<boolean> {
	if (!menu.dragItem.value) {
		return false;
	}

	if (menu.dragItem.value.includes(to.id!)) {
		return false;
	}

	const fromGroups = new Set<string | undefined>();

	const fromIds = new Set<string | undefined>(menu.dragItem.value);

	menu.dragItem.value.forEach(it => {
		const entry = menu.entry(it);

		if (entry.value.value) {
			fromGroups.add(entry.value.value.groupId);
		}
	});

	if (to.isGroup) {
		if (fromGroups.has(to.id)) {
			return false;
		}

		if (fromGroups.has(to.groupId)) {
			return true;
		}
	} else {
		if (fromGroups.has(to.groupId)) {
			return false;
		}
	}

	let parent = to.groupId;

	while (true) {
		if (fromIds.has(parent)) {
			return false;
		}

		if (!parent) {
			break;
		}

		const next = menu.entry(parent);

		if (!next.value.value) {
			await next.reload();
		}

		parent = next.value.value!.groupId;
	}

	return true;
}

/// Call this function when drag start
export async function onDragStart(event: DragEvent, menu: TreeMenu, from: IEntry) {
	if (menu.selected.value?.includes(from.id!)) {
		menu.dragItem.value = menu.selected.value!;
	} else {
		menu.dragItem.value = [from.id!];
	}

	event.dataTransfer!.dropEffect = 'move';
}

/// Call this function when drag enter
export async function onDragEnter(event: DragEvent, menu: TreeMenu, to: IEntry) {
	if (!(await _dropable(menu, to))) {
		return;
	}

	await _dragEnter(menu, to);

	event.preventDefault();
	event.dataTransfer!.dropEffect = 'move';
}
/// Call this function when drag leave
export async function onDragOver(event: DragEvent, menu: TreeMenu, to: IEntry) {
	if (!(await _dropable(menu, to))) {
		return;
	}

	event.preventDefault();
	event.dataTransfer!.dropEffect = 'move';
}
/// Call this function when drag leave
export async function onDragLeave(event: DragEvent, menu: TreeMenu, to: IEntry) {
	if (!(await _dropable(menu, to))) {
		return;
	}

	await _dragLeave(menu, to);
}

function _isChild(menu: TreeMenu, groups: Set<string>, id: string): boolean {
	const entry = menu.entry(id);

	if (!entry.value.value) {
		return false;
	}

	let parent = entry.value.value.groupId;

	if (!parent) {
		return false;
	}

	while (true) {
		if (groups.has(parent!)) {
			return true;
		}

		if (!parent) {
			return false;
		}

		const next = menu.entry(parent);

		if (!entry.value.value) {
			return false;
		}

		parent = next.value.value!.groupId;
	}
}

/// Call this function when drop
export async function onDrop(event: DragEvent, menu: TreeMenu, to: IEntry) {
	event.preventDefault();

	if (!(await _dropable(menu, to))) {
		return;
	}

	await _dragLeave(menu, to);

	const ids = menu.dragItem.value;

	const groups = new Set<string>();

	const files = new Set<string>();

	ids?.forEach(it => {
		const entry = menu.entry(it);

		if (entry.value.value?.isGroup) {
			groups.add(entry.value.value.id!);
		}

		if (entry.value.value && !entry.value.value.isGroup) {
			files.add(entry.value.value.id!);
		}
	});

	const moving = new Set<string>();

	files.forEach(it => {
		if (!_isChild(menu, groups, it)) {
			moving.add(it);
		}
	});

	groups.forEach(it => {
		if (!_isChild(menu, groups, it)) {
			moving.add(it);
		}
	});

	console.log('moving:', moving, to);

	if (to.isGroup) {
		for (const from of moving.values()) {
			await menu.move(from, to.id);
		}
	} else {
		for (const from of moving.values()) {
			await menu.move(from, to.groupId);
		}
	}
}

export function toElementId(id: string): string {
	return `tree-menu-${id}`;
}

export function fromElementId(id: string): string {
	if (id.startsWith('tree-menu-')) {
		return id.substring('tree-menu-'.length);
	}

	return id;
}

export function addSelected(selected: Ref<string[] | undefined>, id: string) {
	if (selected.value) {
		if (!selected.value.includes(id)) {
			selected.value.push(id);
		}
	} else {
		selected.value = [id];
	}
}

export function addOrRemoveSelected(selected: Ref<string[] | undefined>, id: string) {
	if (selected.value) {
		if (!selected.value.includes(id)) {
			selected.value.push(id);
		} else {
			selected.value = selected.value.filter(it => it != id);
		}
	} else {
		selected.value = [id];
	}
}

export function removeSelected(selected: Ref<string[] | undefined>, id: string) {
	if (selected.value) {
		selected.value = selected.value.filter(it => it != id);
	}
}

export function shiftAddSelected(menu: TreeMenu, el: HTMLElement, id: string) {
	let els: Element[];

	if (menu.focused.value) {
		const focused = el.parentElement!.querySelector(`#${toElementId(menu.focused.value)}`)!;

		const children = Array.from(el.parentElement!.children);

		let from = children.findIndex(it => {
			return it == focused;
		});

		let to = children.findIndex(it => {
			return it == el;
		});

		console.log(from, to);
		if (from > to) {
			els = children.slice(to, from);
		} else {
			els = children.slice(from, to);
		}

		els.forEach(it => {
			addSelected(menu.selected, fromElementId(it.id));
		});
	} else {
		addSelected(menu.selected, id);
	}
}
