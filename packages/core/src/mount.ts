import { ElementTree } from './createElement';

export function mount(component : ElementTree, container : HTMLElement) {
	container.appendChild(component);
}
