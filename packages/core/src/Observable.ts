import { Primitive } from 'ts-essentials';
import { BINDING_MARKER } from './markers';

export type UpdateHandler<T> = (newValue : T) => void;

export type BindingTransform<T> = (value : T) => Primitive | Node;

export interface ObservableSubscribeOptions {
	immediate : boolean;
}

export interface Binding {
	[BINDING_MARKER] : (cb : (nodes : Node | Node[]) => void) => void;
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

	public transform(updater : (currentValue : T) => T) : void {
		this.value = updater(this.value);
		this.triggerUpdate();
	}

	public subscribe(onUpdate : UpdateHandler<T>, options : Partial<ObservableSubscribeOptions> = {}) : void {
		this.onUpdate.push(onUpdate);

		let mergedOptions : ObservableSubscribeOptions = Object.assign({
			immediate: true
		}, options);

		if (mergedOptions.immediate) {
			this.triggerUpdate();
		}
	}

	public bind(transform : (val : T) => Node | Node[]) : Binding {
		return {
			[BINDING_MARKER]: (cb) => {
				this.subscribe(value => {
					cb(transform(value));
				});
			},
		};
	}

	public isSet(empty : () => Node | Node[], set : (val : T) => Node | Node[]) : Binding {
		return this.bind(value =>
			value
				? set(value)
				: empty()
		);
	}

	private triggerUpdate() {
		for (let updater of this.onUpdate) {
			updater(this.value);
		}
	}
}

