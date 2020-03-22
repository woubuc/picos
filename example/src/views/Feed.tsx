import Picos, { Component } from '@picos/core';

import './Feed.scss';
import { posts } from '../store';
import FeedPost from '../components/FeedPost';

export default class Feed extends Component {

	render() {
		return <div class="Feed">
			<h2>Your Feed</h2>
			{ posts.map(posts => {
				return posts.map(p => <FeedPost post={ p }/>);
			}) }
		</div>;
	}

}
