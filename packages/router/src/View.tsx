import Picos, { Component } from '@picos/core';
import { Router } from './Router';

export class View extends Component {

	render() {
		return <div>{ Router.view }</div>;
	}

}
