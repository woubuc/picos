import Picos, { Component } from '@picos/core';
import { Header } from './components/Header';
import Feed from './views/Feed';

export default class App extends Component<{ startAt : number }> {

	render() {
		return <div class="App">
			<Header/>
			<Feed/>
		</div>;
	}
}
