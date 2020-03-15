import { Observable } from '@picos/core';
import { PostData } from './models/PostData';

export const posts = new Observable<PostData[]>([
	{ title: 'Post 1', body: 'lorem ipsum' },
	{ title: 'Post 2', body: 'dolor sit amet' },
	{ title: 'Post 3', body: 'lorem 2' },
	{ title: 'Post 4', body: 'dolor sit 2' },
]);
