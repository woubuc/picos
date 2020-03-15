import { Observable } from './Observable';

export class ObservableNumber extends Observable<number> {
	public constructor(initialValue : number = 0) {
		super(initialValue);
	}

	public increment(amount : number = 1) : void {
		this.update(num => num + amount);
	}

	public decrement(amount : number = 1) : void {
		this.update(num => num - amount);
	}
}