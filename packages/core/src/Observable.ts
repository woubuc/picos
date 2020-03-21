import { OBSERVABLE_MARKER } from './markers';

export type OnChangeCallback<T> = (value : T) => void;

/**
 * Minimal observable implementation for Picos
 */
export class Observable<T> {

	public readonly [OBSERVABLE_MARKER] = true;

	private value : T;

	private subscriptions = new Map<number, OnChangeCallback<T>>();
	private subscriptionIdCounter : number = 0;

	public constructor(initialValue : T) {
		this.value = initialValue;
	}

	public get() : T {
		return this.value;
	}

	public set(value : T) : void {
		this.value = value;
		this.triggerChange();
	}

	public update(updater : (currentValue : T) => T) : void {
		this.value = updater(this.value);
		this.triggerChange();
	}

	private triggerChange() {
		for (let cb of this.subscriptions.values()) {
			cb(this.value);
		}
	}

	public subscribe(onChange : OnChangeCallback<T>, options : { immediate ?: boolean } = {}) : number {
		let id = this.subscriptionIdCounter++;
		this.subscriptions.set(id, onChange);

		if (options.immediate !== false) {
			onChange(this.value);
		}

		return id;
	}

	public removeSubscription(id : number) {
		this.subscriptions.delete(id);
	}

	public map<U>(transform : (value : T) => U) : Observable<U> {
		let next = new Observable(transform(this.value));
		this.subscribe(value => next.set(transform(value)), { immediate: false });
		return next;
	}
}

