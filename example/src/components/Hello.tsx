import picos, { Component, Observable } from '@picos/core';

export class Hello extends Component<{ name : Observable<string> }> {
	render() {
		return <p>Hello, { this.props.name }</p>;
	}
}
