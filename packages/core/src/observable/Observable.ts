import { ReadonlyObservable } from './ReadonlyObservable';

export type OnChangeCallback<T> = (value : T) => void;

/**
 * Lightweight observable implementation for Picos
 *
 * An observable is a wrapper around value that notifies all its
 * subscriptions when its value is updated. Observables can be used directly
 * in render templates, and will automatically set up a subscription.
 */
export class Observable<T> extends ReadonlyObservable<T> {

	/**
	 * Sets a new value for the observable
	 *
	 * @param value - The new value
	 *
	 * @throws ReferenceError if the observable is readonly
	 */
	public set(value : T) : void {
		this._set(value);
	}

	/**
	 * Makes changes to the value of the observable
	 *
	 * @param updater - Function that receives the current value and returns the new value
	 */
	public update(updater : (currentValue : T) => T) : void {
		this._set(updater(this.value));
	}
}

