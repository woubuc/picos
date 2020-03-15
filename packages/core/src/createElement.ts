import { Component } from './Component';
import { Binding, Observable } from './Observable';
import { subscribeIfObservable } from './utils';
import { BINDING_MARKER, EMPTY_MARKER } from './markers';

type Constructor<T> = new () => T;

interface RenderState {
	component : Component;
	parent ?: RenderState;
	slot ?: DocumentFragment;
}

let renderState : RenderState | undefined = undefined;

export type ElementTree = any;

export function createElement(tag : string | Constructor<Component>, args : Record<string, any> | null, ...children : any[]) : ElementTree {

	if (typeof tag === 'string') {
		if (tag === 'slot') {
			if (renderState === undefined) {
				throw new Error('Cannot put `slot` outside of component');
			}

			renderState.slot = document.createDocumentFragment();
			return EMPTY_MARKER;
		}

		console.log('<%s>', tag);

		let element = document.createElement(tag);

		if (args !== null) {
			attachArgs(element, args);
		}

		attachChildren(element, children);
		return element;
	}

	let component = new tag();
	Reflect.set(component, 'props', args === null ? {} : args);
	console.group(component.constructor.name);

	renderState = {
		component,
		parent: renderState,
		slot: undefined,
	};

	console.group('.render()');
	let rendered = component.render();
	console.groupEnd();

	if (renderState.slot !== undefined) {
		attachChildren(renderState.slot, children);
	}

	renderState = renderState.parent;
	console.groupEnd();
	return rendered;
}

function attachChildren(element : Node, children : any[]) {
	for (let child of children) {
		if (child === EMPTY_MARKER) {
			continue;
		}

		if (Array.isArray(child)) {
			attachChildren(element, child);
		}

		if (child[BINDING_MARKER] !== undefined) {
			let binding = child as Binding;
			let addedNodes = new Set<Node>();

			binding[BINDING_MARKER](nodes => {
				for (let node of addedNodes.values()) {
					element.removeChild(node);
				}
				addedNodes.clear();

				if (Array.isArray(nodes)) {
					for (let node of nodes) {
						element.appendChild(node);
						addedNodes.add(node);
					}
				} else {
					element.appendChild(nodes);
					addedNodes.add(nodes);
				}
			});
		}

		if (child instanceof Observable) {
			let node = document.createTextNode(child.get());
			child.subscribe(val => node.textContent = val.toString(), { immediate: true });
			element.appendChild(node);
			continue;
		}

		if (child instanceof HTMLElement || child instanceof Node) {
			element.appendChild(child);
			continue;
		}

		let t = typeof child;
		if (t === 'string' || t === 'number') {
			let textNode = document.createTextNode(child);
			element.appendChild(textNode);
			continue;
		}

		console.warn('Unknown child', child);
		return child;
	}
}

function attachArgs(element : HTMLElement, args : Record<string, any>) {
	for (let [key, val] of Object.entries(args)) {

		if (key === 'id') {
			subscribeIfObservable(val, val => element.id = val);
			continue;
		}

		if (key === 'class') {
			subscribeIfObservable(val, val => element.className = val);
			continue;
		}

		if (key === 'model') {
			if (val instanceof Observable) {
				element.addEventListener('input', (evt) => {
					val.set((evt.target as HTMLInputElement).value);
				}, false);
				val.subscribe(val => {
					let el = element as HTMLInputElement;
					if (el.value !== val) {
						el.value = val;
					}
				});
			} else {
				throw new Error('Model must be observable');
			}
		}


		if (key.startsWith('on')) {
			let listener = (renderState !== undefined)
				? args.onclick.bind(renderState.component)
				: args.onclick;

			element.addEventListener(key.slice(2), listener, false);
			continue;
		}

		subscribeIfObservable(val, val => element.setAttribute(key, val));
	}
}
