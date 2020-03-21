import { Observable } from './Observable';
import { ReadonlyObservable } from './ReadonlyObservable';

describe('observable', () => {
	let observable = new Observable(1);

	test('is an observable', () => {
		expect(observable).toBeInstanceOf(Observable);
	});

	test('get() returns the value', () => {
		expect(observable.get()).toEqual(1);
	});

	test('set() sets the value', () => {
		observable.set(2);
		expect(observable.get()).toEqual(2);
	});
});

describe('subscribe', () => {
	let observable = new Observable(1);

	test('callback is called', () => {
		let callback = jest.fn();
		observable.subscribe(callback);
		observable.set(2);
		expect(callback.mock.calls.length).toEqual(2);
	});

	test('callback is not called with immediate=false', () => {
		let callback = jest.fn();
		observable.subscribe(callback, { immediate: false });
		expect(callback.mock.calls.length).toEqual(0);
	});
});

describe('map', () => {
	let observable = new Observable(1);
	let mapped = observable.map(i => i + 1);

	test('is a read-only observable', () => {
		expect(mapped).not.toBeInstanceOf(Observable);
		expect(mapped).toBeInstanceOf(ReadonlyObservable);
	});

	test('get() returns the correct value', () => {
		expect(mapped.get()).toEqual(2);
	});

	test('updates when source updates', () => {
		observable.set(2);
		expect(mapped.get()).toEqual(3);
	});
});
