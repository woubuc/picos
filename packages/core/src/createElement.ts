import { Component } from './Component';
import { Observable } from './observables/Observable';
import { subscribeIfObservable } from './observables/utils';

type Constructor<T> = new () => T;

interface RenderState {
	component : Component;
	parent ?: RenderState;
	slot ?: DocumentFragment;
}

const EMPTY = Symbol('empty_value');

let renderState : RenderState | undefined = undefined;

export type ElementTree = any;

export function createElement(tag : string | Constructor<Component>, args : Record<string, any> | null, ...children : any[]) : ElementTree {

	if (typeof tag === 'string') {
		if (tag === 'slot') {
			if (renderState === undefined) {
				throw new Error('Cannot put `slot` outside of component');
			}

			renderState.slot = document.createDocumentFragment();
			return EMPTY;
		}

		console.log('create element <%s>', tag);
		let element = document.createElement(tag);

		if (args !== null) {
			console.log('  args:', args);
			attachArgs(element, args);
		}
		attachChildren(element, children);
		return element;
	}

	let component = new tag();
	console.group(component.constructor.name);

	renderState = {
		component,
		parent: renderState,
		slot: undefined,
	};

	let rendered = component.render();

	if (renderState.slot !== undefined) {
		attachChildren(renderState.slot, children);
	}

	console.groupEnd();

	renderState = renderState.parent;

	return rendered;
}

function attachChildren(element : Node, children : any[]) {
	console.log('  children for', element);
	for (let child of children) {
		console.log('  ->', child);

		if (child === EMPTY) {
			continue;
		}

		if (Array.isArray(child)) {
			attachChildren(element, child);
		}

		if (child instanceof Component) {
			console.log('  Component found!', child);
			continue;
		}

		if (child instanceof Observable) {
			let node = document.createTextNode(child.get());
			child.subscribe(val => node.textContent = val.toString(), { immediate: true });
			element.appendChild(node);
			continue;
		}

		if (child instanceof HTMLElement) {
			element.appendChild(child);
			continue;
		}

		let t = typeof child;
		if (t === 'string' || t === 'number') {
			let textNode = document.createTextNode(child);
			element.appendChild(textNode);
			continue;
		}

		console.log('Unknown child?', child);
		return child;
	}
}

function attachArgs(element : HTMLElement, args : Record<string, any>) {

	if (args.id) subscribeIfObservable(args.id, val => element.id = val);
	if (args.class) subscribeIfObservable(args.class, val => element.className = val);
	if (args.style) subscribeIfObservable(args.style, val => element.setAttribute('style', val));

	if (args.onclick) {
		let handler = renderState === undefined ? args.onclick : args.onclick.bind(renderState.component);
		element.addEventListener('click', handler, false);
	}
}
