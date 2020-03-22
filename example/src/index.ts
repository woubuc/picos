import Picos from '@picos/core';
import { Router } from '@picos/router';

import './global.scss';
import App from './App';
import Feed from './views/Feed';
import NewPost from './views/NewPost';

Picos.mount(App, document.body);

Router.on('/', () => new Feed({}).render());
Router.on('/new', () => new NewPost({}).render());
