import Picos, { Component, Observable } from '@picos/core';
import { Post } from '../models/Post';

import './FeedPost.scss';

interface Props {
	post : Observable<Post>;
}

export default class FeedPost extends Component<Props> {

	private post = this.props.post;

	read() {
		if (this.post.get().read) return;

		this.post.update(p => {
			p.read = true;
			return p;
		})
	}

	render() {
		return <div
			class={ { FeedPost: true, read: this.post.map(p => p.read) } }
			onmouseenter={ this.read }>

			<h3>{ this.post.map(p => p.title) }</h3>
			<p>{ this.post.map(p => p.body) }</p>
		</div>
	}

}
