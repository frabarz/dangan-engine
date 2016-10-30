import BaseScreen from './Screen.js';

import NSDCylinder from './NSDCylinderSDR2.js';
import NSDBullet from './NSDBullet.js';

export default class NSDScreen extends BaseScreen
{
	constructor(ctx)
	{
		super(ctx);

		this.cylinder = new NSDCylinder(this.ctx);
	}

	addBullet(label)
	{
		var bullet = new NSDBullet(this.ctx);
		this.cylinder.bullets.push(bullet);
	}

	draw()
	{
		this.ctx.clearRect(0, 0, this.W, this.H);
		
		this.cylinder.draw();
	}
}