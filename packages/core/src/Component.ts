import { DeepReadonly } from 'ts-essentials';

export abstract class Component<Props extends Record<string, any> = {}> {

	protected readonly props !: DeepReadonly<Props>;

	public abstract render() : HTMLElement;
}
