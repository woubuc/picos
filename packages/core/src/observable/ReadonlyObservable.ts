import { OBSERVABLE_MARKER } from '../markers';
import { OnChangeCallback } from './Observable';

/**
 * Lightweight observable implementation for Picos
 *
 * An observable is a wrapper around value that notifies all its
 * subscriptions when its value is updated. Observables can be used directly
 * in render templates, and will automatically set up a subscription.
 *
 * The value of a read-only observable can not be updated by a user.
 */
export class ReadonlyObservable<T> {

	/** Marks this as an observable */
	public readonly [OBSERVABLE_MARKER] = true;

	/** The contained value */
	protected value : T;

	/** Active subscriptions to this observable */
	private subscriptions = new Map<number, OnChangeCallback<T>>();

	/** ID counter for new subscriptions */
	private subscriptionIdCounter : number = 0;

	/**
	 * Creates a new observable
	 *
	 * @param initialValue - The initial value of the observable
	 */
	public constructor(initialValue : T) {
		this.value = initialValue;
	}

	/**
	 * Returns the contained value of the observable
	 */
	public get() : T {
		return this.value;
	}

	/**
	 * Sets a new value for the observable
	 *
	 * This method is meant for internal use, and works even in a
	 * readonly observable.
	 *
	 * @param value - The new value
	 *
	 * @internal
	 */
	protected _set(value : T) : void {
		this.value = value;
		this.triggerChange();
	}

	/**
	 * Triggers a change event for all subscriptions
	 */
	protected triggerChange() {
		for (let cb of this.subscriptions.values()) {
			cb(this.value);
		}
	}

	/**
	 * Subscribes to the observable
	 *
	 * @param onChange - Called when the observable value changes
	 * @param options  - Subscription options
	 *
	 * @returns The subscription ID
	 */
	public subscribe(onChange : OnChangeCallback<T>, options : { immediate ?: boolean } = {}) : number {
		let id = this.subscriptionIdCounter++;
		this.subscriptions.set(id, onChange);

		if (options.immediate !== false) {
			onChange(this.value);
		}

		return id;
	}

	/**
	 * Removes a previously made subscription
	 *
	 * @param id - The subscription ID
	 */
	public removeSubscription(id : number) {
		this.subscriptions.delete(id);
	}

	/**
	 * Maps the observable value onto a new observable through a transform function
	 *
	 * This function will create a new observable that is subscribed to the original
	 * observable and will automatically update when the source value updates.
	 *
	 * @param transform - Function that receives the value of the observable
	 *                    and returns a transformed value
	 */
	public map<U>(transform : (value : T) => U) : ReadonlyObservable<U> {
		let next = new ReadonlyObservable(transform(this.value));

		this.subscribe(value => {
			next._set(transform(value));
		}, { immediate: false });

		return next;
	}
}
