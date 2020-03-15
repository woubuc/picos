import picos, { Component } from '@picos/core';

import { Feed } from './views/feed/Feed';
import { Header } from './components/Header';

export class App extends Component {

	render() {
		return <div class="App">
			<Header />
			<Feed />
		</div>;
	}
}
