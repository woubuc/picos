import { Observable } from '@picos/core';
import { Post } from './models/Post';

export const posts = new Observable<Observable<Post>[]>([
	new Observable(new Post('Post 1', 'Hello world')),
	new Observable(new Post('Post 2', 'This is a post')),
	new Observable(new Post('Post 3', 'This is another post')),
	new Observable(new Post('Post 4', 'Lorem ipsum etcetera')),
]);
