import { Observable } from '../Observable';
import { BINDING_MARKER, OBSERVABLE_MARKER } from '../markers';

type ClassListResult = { static : string[], observables : Record<string, Observable<any>> };

export function Class(element : HTMLElement, value : any) {

	let classes = buildClassList(value);

	element.classList.forEach(c => {
		if (!classes.static.includes(c)) {
			element.classList.remove(c);
		}
	});

	for (let c of classes.static) {
		element.classList.add(c);
	}

	for (let [k, o] of Object.entries(classes.observables)) {
		o.subscribe(value => {
			let has = element.classList.contains(k);
			let shouldHave = !!value;

			if (shouldHave && !has) {
				element.classList.add(k);
			} else if (!shouldHave && has) {
				element.classList.remove(k);
			}
		});
	}
}


function buildClassList(
	val : any,
	result : ClassListResult = { static: [], observables: {} },
) : ClassListResult {

	if (typeof val === 'string') {
		if (val.includes(' ')) {
			result.static.push(...val.split(' '));
		} else {
			result.static.push(val);
		}

		return result;
	}

	if (Array.isArray(val)) {
		for (let i of val) {
			result = buildClassList(i, result);
		}

		return result;
	}

	if (typeof val === 'object') {
		for (let [k, v] of Object.entries(val as Record<string, any>)) {
			if (v[OBSERVABLE_MARKER] === true) {
				result.observables[k] = v;
			} else if (v[BINDING_MARKER] !== undefined) {
				result.observables[k] = v[BINDING_MARKER];
			} else if (!!v) {
				result.static.push(k);
			}
		}

		return result;
	}

	throw new Error(`Invalid value for class attribute: '${ val }'`);
}
