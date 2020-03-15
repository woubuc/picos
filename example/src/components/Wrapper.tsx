import picos, { Component } from '@picos/core';

export class Wrapper extends Component {
	render() {
		return <div style="border:2px solid #ccc">
			<slot/>
		</div>;
	}
}
