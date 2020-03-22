import Picos, { Component, Observable } from '@picos/core';
import { Router } from '@picos/router';

import './Feed.scss';
import { posts } from '../store';
import { Post } from '../models/Post';

export default class NewPost extends Component {

	text = new Observable('');

	post() : void {
		posts.update(posts => {
			posts.push(new Observable(new Post('New Post on ' + new Date().toLocaleDateString(), this.text.get())));
			return posts;
		});

		this.text.set('');
		Router.redirect('/');
	}

	render() {
		return <div class="Feed">
			<h2>New Post</h2>

			<textarea style="display:block;width: 100%;height:140px" placeholder="Enter new post" model={ this.text } />
			<button onclick={ this.post }>Add Post</button>
		</div>;
	}
}
