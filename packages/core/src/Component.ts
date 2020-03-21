import { COMPONENT_MARKER } from './markers';
import { DeepReadonly } from 'ts-essentials';

export type ComponentConstructor<Props extends Record<string, any> = Record<string, any>> = new (props : Props) => Component<Props>;

/**
 * The base class for every component
 *
 * The generic type defines the component props passed to the constructor.
 */
export abstract class Component<Props extends Record<string, any> = Record<string, any>> {

	/**
	 * Symbol marker to identify components
	 */
	static readonly [COMPONENT_MARKER] = true;

	/**
	 * The component props
	 */
	protected readonly props : DeepReadonly<Props>;

	/**
	 * The constructor takes the component props and assigns them to the `props`
	 * property of the instance. Components can implement their own constructor
	 * if they need to do some startup logic, and call `super(props)` to run the
	 * default component creation logic.
	 *
	 * @param props - The component props
	 */
	public constructor(props : DeepReadonly<Props>) {
		this.props = props;
	}

	/**
	 * Every component must implement the render method.
	 */
	public abstract render() : Node;
}
