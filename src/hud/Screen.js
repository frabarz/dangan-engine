import BaseElement from './Element.js';

export default class Interface extends BaseElement
{
	constructor(ctx)
	{
		super(ctx);

		this.type = 'HUD.Screen';
	}
}