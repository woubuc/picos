import { Class } from './Class';
import { Model } from './Model';

export type AttributeHandler = (node : HTMLElement, value : any) => void;

export const registeredAttributes = new Map<string, AttributeHandler>();

export function registerAttribute(attr : string, handler : AttributeHandler) : void {
	if (registeredAttributes.has(attr)) {
		throw new Error(`Cannot add attribute '${ attr }': an attribute with this name is already registered.`);
	}

	registeredAttributes.set(attr, handler);
}

registerAttribute('class', Class);
registerAttribute('model', Model);
