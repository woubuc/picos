import { Observable } from '@picos/core';
import UrlPattern from 'url-pattern';

export type RouterHandler = (query : URLSearchParams, params : Record<string, any>) => Node;

const EMPTY_VIEW = document.createTextNode('');

export class Router {

	public static view = new Observable<Node>(EMPTY_VIEW);

	private static routes = new Map<UrlPattern, RouterHandler>();

	public static on(url : string, handler : RouterHandler) : void {
		let pat = new UrlPattern(url);
		this.routes.set(pat, handler);

		if (pat.match(window.location.pathname)) {
			this.update();
		}
	}

	public static redirect(to : string) {
		window.history.pushState(null, '', to);
		this.update();
	}

	public static update() {
		let url = window.location.pathname;

		for (let [pat, handler] of this.routes.entries()) {
			if (pat.match(url)) {
				let view = handler(new URLSearchParams(window.location.search), {});
				this.view.set(view);
				return;
			}
		}

		this.view.set(EMPTY_VIEW);
	}
}

window.onpopstate = () => Router.update();
