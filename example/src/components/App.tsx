import picos, { Component, Observable, ObservableArray, ObservableNumber } from '@picos/core';

import { Wrapper } from './Wrapper';
import { Hello } from './Hello';

export class App extends Component {

	input = {};

	name = new Observable('');
	counter = new ObservableNumber(0);
	posts = new ObservableArray(['foo', 'bar', 'baz']);

	onClick() {
		console.log('Clicked!');
		this.counter.update(i => i + 1);
	}

	render() {
		return <div>
			<h1 class="red">Hello World</h1>
			<button onclick={ this.onClick }>I was clicked { this.counter } times</button>
			<input ref={ this.input }/>

			{ this.name.bind(name => name
				? <Hello name={ this.name }/>
				: ''
			) }

			<Wrapper>
				<p>Hello world</p>
			</Wrapper>

			{ this.posts.map(post => <p>{ post }</p>) }
		</div>;
	}
}
