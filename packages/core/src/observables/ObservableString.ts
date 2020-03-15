import { Observable } from './Observable';

export class ObservableString extends Observable<string> {
	public constructor(initialValue : string = '') {
		super(initialValue);
	}
}
