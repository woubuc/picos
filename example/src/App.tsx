import Picos, { Component } from '@picos/core';
import { View } from '@picos/router';

import { Header } from './components/Header';

export default class App extends Component<{ startAt : number }> {

	render() {
		return <div class="App">
			<Header />
			<View />
		</div>;
	}
}
