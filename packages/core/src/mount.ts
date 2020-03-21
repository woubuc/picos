/**
 * Mounts a component or a tree to the DOM
 *
 * @param component -
 * @param container
 */

import { ComponentConstructor } from './Component';
import { createElement } from './createElement';

export function mount(component : ComponentConstructor<any> | Node, container : Node) {
	if (component instanceof Node) {
		container.appendChild(component);
	} else {
		container.appendChild(createElement(component, null));
	}
}
