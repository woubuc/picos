import { COMPONENT_MARKER, OBSERVABLE_MARKER } from './markers';
import { Observable } from './observable/Observable';
import { flatten } from './utils';
import { registeredAttributes } from './attributes';
import { ComponentConstructor, Component } from './Component';
import { ReadonlyObservable } from './observable/ReadonlyObservable';

let currentComponent : Component | undefined = undefined;

export function createElement(
	tag : string | ComponentConstructor,
	attributes : Record<string, any> | null,
	...children : any[]
) : Node {

	if (typeof tag === 'string') {

		let element = document.createElement(tag); //new PicosElement(tag);

		if (attributes !== null) {
			for (let [key, value] of Object.entries(attributes)) {
				let attr = registeredAttributes.get(key);
				if (attr === undefined) {
					if (key.startsWith('on')) {
						let listener = value;

						if (currentComponent !== undefined) {
							listener = listener.bind(currentComponent);
						}

						element.addEventListener(key.slice(2), listener, false);
					} else {
						element.setAttribute(key, value);
					}
				} else {
					attr(element, value);
				}
			}
		}

		for (let child of flatten(children)) {
			let childElement = toElement(child);
			element.appendChild(childElement);
		}

		return element;
	}

	if (tag[COMPONENT_MARKER] === true) {
		let C = tag as ComponentConstructor;

		currentComponent = new C(attributes || {});
		let rendered = currentComponent.render();
		currentComponent = undefined;

		return rendered;
	}

	throw new TypeError('Invalid element: ' + tag);
}

/**
 * Turns a child entry of createElement into an element of its own
 *
 * @param source - Value of the child entry
 */
function toElement(source : any) : Node {

	if (Array.isArray(source)) {
		// TODO avoid having to add this extra div
		let parent = document.createElement('div');
		parent.setAttribute('data-inserted', 'true');
		for (let i of source) {
			parent.appendChild(toElement(i));
		}
		return parent;
	}

	if (source instanceof Node) {
		return source;
	}

	if (typeof source === 'string' || typeof source === 'number') {
		return document.createTextNode(source.toString());
	}

	if (source[OBSERVABLE_MARKER]) {
		let observable = source as ReadonlyObservable<any>;
		let previousNode : Node = toElement(observable.get());
		observable.subscribe(value => {
			let newNode = toElement(value);
			previousNode?.parentNode?.replaceChild(newNode, previousNode);
			previousNode = newNode;
		}, { immediate: false });
		return previousNode;
	}

	console.error('Invalid child:', source);
	throw new TypeError(`Invalid child`);
}
