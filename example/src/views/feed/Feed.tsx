import picos, { Component, Observable } from '@picos/core';

import './Feed.scss';
import { posts } from '../../store';
import { FeedPost } from './FeedPost';

export class Feed extends Component {

	text = new Observable('');

	post() : void {
		posts.transform(posts => {
			posts.push({
				title: 'New Post on ' + new Date().toLocaleDateString(),
				body: this.text.get(),
			});
			return posts;
		});

		this.text.set('');
	}

	render() {
		return <div class="Feed">
			<h2>Your Feed</h2>

			<textarea placeholder="Enter new post" model={ this.text } />
			<button onclick={ this.post }>Add Post</button>

			{ posts.bind(posts =>
				posts.map(p => <FeedPost post={ p } />)
			) }

		</div>;
	}

}
