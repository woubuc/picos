import picos, { Component } from '@picos/core';
import { PostData } from '../../models/PostData';

import './FeedPost.scss';

export class FeedPost extends Component<{ post : PostData }> {

	render() {
		let post = this.props.post;

		return <div class="FeedPost">
			<h3>{ post.title }</h3>
			<p>{ post.body }</p>
		</div>
	}

}
