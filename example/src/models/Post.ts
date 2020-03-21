export class Post {

	public readonly title : string;
	public readonly body : string;

	public read : boolean;

	public constructor(title : string, body : string) {
		this.title = title;
		this.body = body;
		this.read = false;
	}

}
