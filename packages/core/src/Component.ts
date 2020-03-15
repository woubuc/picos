export abstract class Component<Props extends Record<string, any> = Record<string, any>> {

	protected readonly props !: Props;

	public constructor(props : Props) {
		console.log('Component %s with props:', this.constructor.name, props);
	}

	public abstract render() : HTMLElement;
}
