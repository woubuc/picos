import Picos, { Component, Observable } from '@picos/core';

import './Feed.scss';
import { posts } from '../store';
import { Post } from '../models/Post';
import FeedPost from './FeedPost';

export default class Feed extends Component {

	text = new Observable('');

	post() : void {
		posts.update(posts => {
			posts.push(new Observable(new Post('New Post on ' + new Date().toLocaleDateString(), this.text.get())));
			return posts;
		});

		this.text.set('');
	}

	render() {
		return <div class="Feed">
			<h2>Your Feed</h2>

			<textarea placeholder="Enter new post" model={ this.text } />
			<button onclick={ this.post }>Add Post</button>

			{ posts.map(posts => {
				return posts.map(p => <FeedPost post={ p }/>);
			}) }
		</div>;
	}

}
