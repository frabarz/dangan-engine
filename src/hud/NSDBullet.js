import BaseElement from './Element.js';

var TEXTURES = (function () {
	function preloadImg(url) {
		var img = new Image();
		img.src = url;
		return img;
	}

	return {
		BOTTOM: preloadImg('/resources/textures/bullet_1.svg'),
		BODY: preloadImg('/resources/textures/bullet_2.svg'),
		CAP: preloadImg('/resources/textures/bullet_3.svg')
	};
})();


class HUDNSDBullet extends BaseElement
{
	constructor(ctx, text, i)
	{
		super(ctx);

		this.order = i;
		this.text = text;

		this.x = 0;
		this.y = 0;

		this.setScale(1);
	}

	setScale(s)
	{
		this.scale = s;
		this.font = Math.floor(36 * s) + 'px Calibri';

		this.ctx.save();
		this.ctx.font = this.font;
		this.textWidth = Math.floor(this.ctx.measureText(this.text).width);
		this.ctx.restore();
	}

	draw(r)
	{
		var h = TEXTURES.BOTTOM.naturalHeight * this.scale,
			w1 = TEXTURES.BOTTOM.naturalWidth * this.scale,
			w3 = TEXTURES.CAP.naturalWidth * this.scale,
			y = this.y * 60 * this.scale;

		this.ctx.save();

		this.ctx.globalAlpha = this.opacity;

		this.ctx.drawImage(TEXTURES.BOTTOM, this.x, y - h / 2, w1, h);
		this.ctx.drawImage(TEXTURES.BODY, this.x + w1 - 1, y - h / 2, this.textWidth, h);
		this.ctx.drawImage(TEXTURES.CAP, this.x + w1 + this.textWidth - 2, y - h / 2, w3, h);

		this.ctx.beginPath();
		this.ctx.font = this.font;
		this.ctx.textAlign = 'left';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(this.text, this.x + w1 * 0.6, y);

		this.ctx.restore();
	}
}

export default HUDNSDBullet