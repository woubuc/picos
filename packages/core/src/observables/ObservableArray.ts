import { Observable } from './Observable';

export class ObservableArray<T> extends Observable<T[]> {
	public constructor(initialValue : T[] = []) {
		super(initialValue);
	}

	public push(...items : T[]) : void {
		this.update(arr => {
			arr.push(...items);
			return arr;
		});
	}

	public unshift(...items : T[]) : void {
		this.update(arr => {
			arr.unshift(...items);
			return arr;
		});
	}

	public pop() : T | undefined {
		let popped : T | undefined = undefined;
		this.update(arr => {
			popped = arr.pop();
			return arr;
		});
		return popped;
	}

	public shift() : T | undefined {
		let shifted : T | undefined = undefined;
		this.update(arr => {
			shifted = arr.shift();
			return arr;
		});
		return shifted;
	}

	public map<U>(map : (item : T) => U) : U[] {
		return this.get().map(map);
	}
}