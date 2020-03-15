import { Primitive } from 'ts-essentials';

export type UpdateHandler<T> = (newValue : T) => void;

export type BindingTransform<T> = (value : T) => Primitive | Node;

export interface ObservableSubscribeOptions {
	initial ?: boolean;
}

export class Observable<T> {

	private onUpdate : UpdateHandler<T>[] = [];
	private value : T;

	public constructor(initialValue : T) {
		this.value = initialValue;
	}

	public get() : T {
		return this.value;
	}

	public set(value : T) : void {
		this.value = value;
		this.triggerUpdate();
	}

	public update(updater : (currentValue : T) => T) : void {
		this.value = updater(this.value);
		this.triggerUpdate();
	}

	public subscribe(onUpdate : UpdateHandler<T>, options : Partial<{ immediate : boolean }> = {}) : void {
		this.onUpdate.push(onUpdate);

		if (options.immediate) {
			this.triggerUpdate();
		}
	}

	public bind(bind : (val : T) => any) : void {
		console.log('bind', bind);
	}

	public isSet(empty : () => any, set : (val : T) => any) : void {
		return this.bind(val => !val ? empty() : set(val));
	}

	private triggerUpdate() {
		for (let updater of this.onUpdate) {
			updater(this.value);
		}
	}
}

