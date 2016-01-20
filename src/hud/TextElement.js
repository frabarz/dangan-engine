import Element from './Element.js';

export default class TextElement extends Element
{
	constructor(ctx, text, speaker)
	{
		super(ctx);

		this.type = 'HUD.TextElement';

		this.text = text || '';
		this.color = 'white';

		this.x = 0;
		this.y = 0;

		this.maxWidth = 0.9 * this.W;
		this.marginLeft = 0;

		this.font = (0.06 * this.H) + 'px Calibri';
		this.color = 'white';
		this.lineHeight = 0.08 * this.H;

		this.typewrite = false;
		this.typewLength = 0;
	}

	draw(t)
	{
		this.ctx.save();

		this.ctx.globalAlpha = this.opacity;
		this.ctx.fillStyle = this.color;
		this.ctx.font = this.font;

		this.writeLine(this.text, this.marginLeft + this.x, this.y, this.maxWidth);
		// this.writeLine(this.text, this.y, this.maxWidth);

		this.ctx.restore();
	}

	typewriteStep(text)
	{
		if (text.length > this.typewLength)
			this.typewLength += 1;

		return text.substr(0, this.typewLength);
	}

	writeLine(text, x, y, maxWidth)
	{
		text = this.typewrite ? this.typewriteStep(text) : text;

		var lastWord = '',
			size = this.ctx.measureText(text).width,
			currentLine = text.split(' '),
			nextLine = [];

		while (size > maxWidth)
		{
			lastWord = currentLine.pop();
			nextLine.unshift(lastWord);
			text = currentLine.join(' ');
			size = this.ctx.measureText(text).width;
		}

		if (currentLine.length > 0)
		{
			this.ctx.fillText(text, x, y);

			if (nextLine.length > 0)
				this.writeLine(nextLine.join(' '), x, y + this.lineHeight, maxWidth);
		}
		else
		{
			throw new Error('El texto contiene una palabra más ancha que el ancho máximo del canvas.');
		}

		lastWord = null;
		size = null;
		currentLine = null;
		nextLine = null;
	}

	draw2(ctx) {
		var rem = text.substr(this.textAdvance),
			// if ' ' not in text, use text.length, else use position
			space = (rem.indexOf(' ') + 1 || text.length + 1) - 1,
			wordwidth = this.ctx.measureText(rem.substring(0, space)).width;
		var w = ctx.measureText(str.charAt(i)).width;
		if (cursorX + wordwidth >= canvas.width - padding) {
			cursorX = startX;
			cursorY += lineHeight;
		}
		ctx.fillText(str.charAt(i), cursorX, cursorY);
		i++;
		cursorX += w;
	}
}
