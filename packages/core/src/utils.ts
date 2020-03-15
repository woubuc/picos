import { Observable } from './Observable';

export function subscribeIfObservable<T>(maybeObservable : T | Observable<T>, apply : (val : T) => void) : void {
	if (maybeObservable instanceof Observable) {
		maybeObservable.subscribe(val => apply(val));
	} else {
		apply(maybeObservable);
	}
}
