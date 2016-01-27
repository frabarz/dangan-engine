export default class HudRenderer
{
	constructor(width, height)
	{
		this.W = width;
		this.H = height;

		let canvas = document.createElement('canvas');

		canvas.width = width;
		canvas.height = height;

		this.ctx = canvas.getContext('2d');

		this.blackScreen = 0;

		canvas = null;
	}

	get canvas()
	{
		return this.ctx.canvas;
	}

	drawBlackScreen(opacity)
	{
		this.ctx.save();

		this.ctx.globalAlpha = Math.min(this.blackScreen, 1);
		this.ctx.fillStyle = '#000000';
		this.ctx.fillRect(0, 0, this.W, this.H);

		this.ctx.restore();
	}

	render(time)
	{
		this.ctx.clearRect(0, 0, this.W, this.H);

		this.processor && this.processor(time);

		if (this.screen)
			this.screen.draw(time);

		if (this.blackScreen > 0)
			this.drawBlackScreen();
	}
}