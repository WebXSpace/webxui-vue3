import { Ref, ComponentInternalInstance } from 'vue';

export interface IMenuGroup {
	// selected menu path
	readonly selected: Ref<string>;
	// popup menu group
	readonly popup: Ref<boolean>;
	// popup menu click event
	onclick(path: string, selectable: boolean): void;
	/// select menu but not emit click event
	select(path: string): void;
}

export interface IMenu {
	readonly self: ComponentInternalInstance; // menu component instance
	readonly path: string;
	readonly menuGroup: IMenuGroup; // MenuGroup component instance
}

const _groups = new Map<number, ComponentInternalInstance>();

const _menus = new Map<number, IMenu>();

/**
 * Call by menu components implementation, to register new menu group instance
 * @param instance menu component instance
 */
export function mountMenuGroup(instance: ComponentInternalInstance) {
	_groups.set(instance.uid, instance);
}

/**
 * Unmount menu group instance
 * @param instance
 */
export function unmountMenuGroup(instance: ComponentInternalInstance) {
	_groups.delete(instance.uid);
}

export function mountMenu(instance: ComponentInternalInstance, id: string): IMenu {
	let next: ComponentInternalInstance | null = instance;

	while (next) {
		const uid = next.parent?.uid;

		if (uid) {
			const group = _groups.get(uid);

			if (group) {
				const menuGroup = group.exposed as IMenuGroup;

				const newMenu = {
					self: instance,
					path: `/${id}`,
					menuGroup: menuGroup,
				};

				_menus.set(instance.uid, newMenu);

				return newMenu;
			}

			const menu = _menus.get(uid);

			if (menu) {
				const newMenu = {
					self: instance,
					path: `${menu.path}/${id}`,
					menuGroup: menu.menuGroup,
				};
				_menus.set(instance.uid, newMenu);

				return newMenu;
			}
		}

		next = next.parent;
	}

	throw new Error('MenuGroup missing !!!');
}

/**
 * Unmount menu group instance
 * @param instance
 */
export function unmountMenu(instance: ComponentInternalInstance) {
	_menus.delete(instance.uid);
}
