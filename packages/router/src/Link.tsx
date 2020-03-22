import Picos, { Component } from '@picos/core';
import { Router } from './Router';

export class Link extends Component<{ href : string }> {

	onClick(evt : Event) {
		evt.preventDefault();
		evt.stopPropagation();

		Router.redirect(this.props.href);
	}

	render() {
		return <a href={ this.props.href } onclick={ this.onClick }>Link</a>;
	}
}
