import BaseElement from './Element.js';

export default class NSDCylinder extends BaseElement
{
	constructor(ctx)
	{
		super(ctx);

		this.type = 'HUD.NSD.Cylinder';

		this.bullets = [];
		this.giro = 0;
	}

	setScale()
	{
		this.r = this.H * 0.45 * 0.8;

		this.x = this.r * -0.1;
		this.y = this.H * 0.58;

		var n = this.bullets.length;
		while (n--)
			this.bullets[n].setScale(this.r / 200);
	}

	loadBullet(bullet)
	{
		this.bullets.push(bullet);
		bullet.setScale(this.r / 200);
	}
}