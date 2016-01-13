import HUDElement from './HUDElement.js';

var TEXTURES = (function () {
    function preloadImg(url) {
        var img = new Image();
        img.src = url;
        return img;
    }

    return {
        BOTTOM: preloadImg('/textures/bullet_1.svg'),
        BODY: preloadImg('/textures/bullet_2.svg'),
        CAP: preloadImg('/textures/bullet_3.svg')
    };
})();

class HUDNSDBullet extends HUDElement
{
    constructor(ctx, text, i)
    {
        super(ctx);
        
		this.context = ctx;
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

        this.context.save();
        this.context.font = this.font;
        this.textWidth = Math.floor(this.context.measureText(this.text).width);
        this.context.restore();
    }
    
    draw(r)
    {
        var h = TEXTURES.BOTTOM.naturalHeight * this.scale,
            w1 = TEXTURES.BOTTOM.naturalWidth * this.scale,
            w3 = TEXTURES.CAP.naturalWidth * this.scale,
            y = this.y * 60 * this.scale;

        this.context.save();

        this.context.globalAlpha = this.opacity;

        this.context.drawImage(TEXTURES.BOTTOM, this.x, y - h / 2, w1, h);
        this.context.drawImage(TEXTURES.BODY, this.x + w1 - 1, y - h / 2, this.textWidth, h);
        this.context.drawImage(TEXTURES.CAP, this.x + w1 + this.textWidth - 2, y - h / 2, w3, h);

        this.context.beginPath();
        this.context.font = this.font;
        this.context.textAlign = 'left';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = 'white';
        this.context.fillText(this.text, this.x + w1 * 0.6, y);

        this.context.restore();
    }
}

export default HUDNSDBullet