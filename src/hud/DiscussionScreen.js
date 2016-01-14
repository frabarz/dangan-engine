import BaseScreen from './Screen.js';
import TextElement from './TextElement.js'

class DiscussionScreen extends BaseScreen
{
	constructor(ctx)
	{
		super(ctx);

		this.gradients = (function () {
			var width = ctx.canvas.width,
				speakerCardBg = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height),
				protagDiscLeft = ctx.createLinearGradient(0, 0, width, 0),
				labelDiscLeft = ctx.createLinearGradient(0, 0, width, 0),
				labelDiscRight = ctx.createLinearGradient(0, 0, width, 0);

			speakerCardBg.addColorStop(0, '#FF0000');
			speakerCardBg.addColorStop(0.25, '#000000');
			speakerCardBg.addColorStop(0.5, '#FF0000');
			speakerCardBg.addColorStop(0.75, '#000000');
			speakerCardBg.addColorStop(1, '#FF0000');

			protagDiscLeft.addColorStop(0, '#CC0000');
			protagDiscLeft.addColorStop(0.65, 'rgb(255, 51, 51)');
			protagDiscLeft.addColorStop(0.75, 'rgba(255, 51, 51, 0)');

			labelDiscLeft.addColorStop(0.65, 'rgb(255, 51, 51)');
			labelDiscLeft.addColorStop(0.75, 'rgba(255, 51, 51, 0)');

			labelDiscRight.addColorStop(0.65, 'rgb(255, 51, 51)');
			labelDiscRight.addColorStop(0.75, 'rgba(255, 51, 51, 0)');

			return {
				nameprotagLeft: protagDiscLeft,
				nametagLeft: labelDiscLeft,
				nametagRight: labelDiscRight,
				speakerCardBackground: speakerCardBg
			};
		})();

		this.caseNumber = '01';

		this.banner_x = 0;

		this.speakerCardRotation = 0;

		this.dialogue = new TextElement(ctx);
		this.dialogue.x = 0.05 * this.W;
		this.dialogue.y = 0.8 * this.H;
		this.dialogue.typewrite = true;

		this.nametag = new TextElement(ctx);
		this.nametag.x = 0.03 * this.W;
		this.nametag.y = 0.675 * this.H;
		this.nametag.font = (0.04 * this.H) + 'px Segoe UI';

		this.add(this.dialogue, this.nametag);
	}

	setDialogue(speaker, text)
	{
		this.nametag.text = 'Monokuma'.toUpperCase();

		this.dialogue.text = text;
		this.dialogue.typewLength = 0;

		if (speaker == 'narrator')
			this.dialogue.color = DiscussionScreen.COLOR_NARRATOR;
		else
			this.dialogue.color = DiscussionScreen.COLOR_CHARACTER;
	}

	setSpeaker(entity)
	{
	}

	drawClassTrialBanner()
	{
		this.ctx.save();

		this.ctx.font = (0.08 * this.H) + 'px Goodbye Despair';
		this.ctx.globalAlpha = 0.5;
		this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
		this.ctx.strokeStyle = 'white';
		this.ctx.lineWidth = this.H / 500;

		var width = this.ctx.measureText('class trial ').width;

		this.ctx.fillText('class trial class trial class trial class trial class trial ', this.banner_x, 0.06 * this.H);
		this.ctx.strokeText('class trial class trial class trial class trial class trial ', this.banner_x, 0.06 * this.H);

		this.banner_x -= this.W / 1000;
		if (this.banner_x < -width)
			this.banner_x += width;

		width = null;

		this.ctx.restore();
	}

	drawSpeakerCard()
	{
		var y,
			width = 0.19 * this.W;

		this.ctx.save();

		// Black background
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, width, 0.63 * this.H);

		// "CASE" background polygon
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0);
		this.ctx.lineTo(0.1 * this.W, 0);
		this.ctx.lineTo(0.1 * this.W + 0.07 * this.H, 0.07 * this.H);
		this.ctx.lineTo(0, 0.07 * this.H);
		this.ctx.closePath();

		this.ctx.fillStyle = '#999999';
		this.ctx.fill();

		this.ctx.font = 0.06 * this.H + 'px Goodbye Despair';

		// "CASE"
		this.ctx.fillStyle = '#ffffff';
		this.ctx.fillText('case', 0.01 * this.W, 0.054 * this.H);

		// Case number
		this.ctx.fillStyle = '#ff3333';
		this.ctx.fillText(this.caseNumber, 0.1 * this.W + 0.08 * this.H, 0.054 * this.H);

		this.ctx.save();

		this.ctx.beginPath();
		this.ctx.rect(0, 0.075 * this.H, width - 0.005 * this.H, 0.55 * this.H);
		this.ctx.clip();

		this.speakerCardRotation += 0.03;

		if (this.speakerCardRotation >= 1)
			this.speakerCardRotation = -1;

		// Card image background gradient
		this.ctx.fillStyle = this.gradients.speakerCardBackground;
		this.ctx.fillRect(0, this.speakerCardRotation * this.H / 20, width, this.H)

		this.ctx.strokeStyle = '#' + ('0' + Math.floor(Math.abs(this.speakerCardRotation * 255)).toString(16)).slice(-2) + '0000';
		this.ctx.lineWidth = this.H / 200;
		// Card image background line pattern
		y = 0.625 + width / this.H;
		while (y > 0.075)
		{
			this.ctx.beginPath();
			this.ctx.moveTo(width - 0.0025 * this.H, y * this.H);
			this.ctx.lineTo(-0.0025 * this.H, y * this.H - width);
			this.ctx.stroke();
			y -= 0.03;
		}

		this.ctx.restore();

		this.ctx.strokeStyle = '#ffffff';
		this.ctx.lineWidth = this.H / 500;

		// White line next to case number
		this.ctx.beginPath();
		this.ctx.moveTo(width - 0.005 * this.H, 0);
		this.ctx.lineTo(width - 0.005 * this.H, 0.07 * this.H);
		this.ctx.stroke();

		// White line around card image
		this.ctx.strokeRect(-0.005 * this.H, 0.075 * this.H, width, 0.55 * this.H);

		this.ctx.restore();

		width = null;
	}

	drawBackground()
	{
		this.ctx.save();

		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
		this.ctx.fillRect(0, this.H * 0.69, this.W, this.H * 0.31);

		this.ctx.fillStyle = this.gradients.nametagLeft;
		this.ctx.fillRect(0, this.H * 0.63, this.W, this.H * 0.06);

		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, this.H * 0.69, this.W, this.H * 0.02);

		this.ctx.fillStyle = '#FF0066';
		this.ctx.fillRect(0, this.H * 0.71, this.W, this.H * 0.01);

		this.ctx.restore();
	}

	draw(time)
	{
		this.ctx.clearRect(0, 0, this.W, this.H);

		this.drawBackground();
		this.drawClassTrialBanner();
		this.drawSpeakerCard();

		this.dialogue.draw();
		this.nametag.draw();
	}
}

DiscussionScreen.COLOR_NARRATOR = '#47FF19';
DiscussionScreen.COLOR_CHARACTER = 'white';

export default DiscussionScreen