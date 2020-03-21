import { Observable } from '../Observable';
import { OBSERVABLE_MARKER } from '../markers';

export function Model(node : HTMLElement, value : Observable<any>) {
	if (value[OBSERVABLE_MARKER] !== true) {
		throw new TypeError('Model value must be observable.');
	}

	if (!(node instanceof HTMLInputElement) && !(node instanceof HTMLTextAreaElement)) {
		throw new TypeError('Model element must be an input element');
	}

	node.addEventListener('input', (evt) => {
		value.set((evt.target as HTMLInputElement).value);
	}, false);

	value.subscribe(value => {
		if (node.value !== value) {
			node.value = value;
		}
	});
}
