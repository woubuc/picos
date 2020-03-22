import Picos, { Component } from '@picos/core';
import { Link } from '@picos/router';

import './Header.scss';

export class Header extends Component {

	render() {
		return <header class="Header">
			<h1>Picos Example</h1>
			<nav>
				<Link href="/">Home</Link>
				<Link href="/new">New Post</Link>
			</nav>
		</header>;
	}

}
