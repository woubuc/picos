import picos, { Component } from '@picos/core';

import './Header.scss';

export class Header extends Component {

	render() {
		return <header class="Header">
			<h1>Picos Example</h1>
		</header>;
	}

}
