import BaseScreen from './Screen.js';
import TextElement from './TextElement.js'

import { NARRATOR } from './../Character.js';

class DiscussionScreen extends BaseScreen
{
	constructor(ctx)
	{
		super(ctx);

		this.gradients = (function () {
			var width = ctx.canvas.width,
				protagDiscLeft = ctx.createLinearGradient(0, 0, width, 0),
				labelDiscLeft = ctx.createLinearGradient(0, 0, width, 0),
				labelDiscRight = ctx.createLinearGradient(0, 0, width, 0);

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
				nametagRight: labelDiscRight
			};
		})();

		this.caseNumber = '02';

		this.banner_x = 0;

		this.speakerCardTimer = 0;
		this.speakerCardImage = new Image();
		this.speakerCardImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

		this.dialogue = new TextElement(ctx);
		this.dialogue.x = 0.05 * this.W;
		this.dialogue.y = 0.8 * this.H;
		this.dialogue.typewrite = true;

		this.nametag = new TextElement(ctx);
		this.nametag.x = 0.03 * this.W;
		this.nametag.y = 0.675 * this.H;
		this.nametag.font = (0.04 * this.H) + 'px DorBlue';

		this.add(this.dialogue, this.nametag);

		console.log(NARRATOR);
	}

	setDialogue(speaker, text)
	{
		if (this.speakerId != speaker.id)
		{
			this.generateInterferencePattern();
			this.interferenceOpacity = 1;

			this.nametag.marginLeft = 0.04 * this.W;
			this.nametag.opacity = 0;
		}

		this.speakerId = speaker.id;
		this.speakerIsProtagonist = speaker.card.counter == 0;
		this.speakerCardImage.src = speaker.bustSpriteUri;

		this.nametag.text = speaker.name.split("").join(String.fromCharCode(8201));

		this.dialogue.color = DiscussionScreen[speaker.id == NARRATOR ? 'COLOR_NARRATOR' : 'COLOR_CHARACTER'];
		this.dialogue.text = text;
		this.dialogue.typewLength = 0;
	}

	setSpeaker(entity)
	{
	}

	generateInterferencePattern()
	{
		this.interferencePattern = this.ctx.createLinearGradient(0, 0.08 * this.H, 0, 0.63 * this.H);

		var n,
			guidea = '0',
			guideb = '0',
			y = Math.floor(this.H / 100);

		while (y--)
		{
			guidea += Math.floor(Math.random() * 500).toString(2);
			guideb += Math.floor(Math.random() * 500).toString(2);
		}

		n = y = Math.min(guidea.length, guideb.length);

		while (y--)
		{
			if (guidea[y] != guideb[y])
			{
				this.interferencePattern.addColorStop(y / n - 0.005, '#ff3333');
				this.interferencePattern.addColorStop(y / n, '#ffffff');
				this.interferencePattern.addColorStop(y / n + 0.005, '#ff3333');
			}
		}
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

		this.speakerCardTimer += 0.03;

		if (this.speakerCardTimer >= 1)
			this.speakerCardTimer = -1;

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
		this.ctx.textAlign = 'right';
		this.ctx.fillStyle = '#ff3333';
		this.ctx.fillText(this.caseNumber, 0.19 * this.W - 0.01 * this.H, 0.054 * this.H);

		this.ctx.restore();

		this.ctx.save();

		this.ctx.beginPath();
		this.ctx.rect(0, 0.075 * this.H, width - 0.005 * this.H, 0.55 * this.H);
		this.ctx.clip();

		// Card image background gradient
		var gradient = this.ctx.createLinearGradient(
			0, (0.08 - 1.1 + 0.55 * this.speakerCardTimer) * this.H,
			0, (0.08 + 1.1 + 0.55 * this.speakerCardTimer) * this.H
			);
		gradient.addColorStop(0, '#FF0000');
		gradient.addColorStop(0.25, '#000000');
		gradient.addColorStop(0.5, '#FF0000');
		gradient.addColorStop(0.75, '#000000');
		gradient.addColorStop(1, '#FF0000');

		this.ctx.fillStyle = gradient;
		this.ctx.fillRect(0, 0, width, this.H);

		gradient = null;

		this.ctx.strokeStyle = '#' + ('0' + Math.floor(Math.abs(this.speakerCardTimer * 255)).toString(16)).slice(-2) + '0000';
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

		y = 1.8 * 0.55 * this.H;
		this.ctx.drawImage(this.speakerCardImage,
			(width - y / this.speakerCardImage.naturalHeight * this.speakerCardImage.naturalWidth) / 2,
			0.075 * this.H,
			y / this.speakerCardImage.naturalHeight * this.speakerCardImage.naturalWidth,
			y
			);

		if (this.interferenceOpacity > 0)
		{
			this.ctx.globalAlpha = this.interferenceOpacity;
			this.ctx.fillStyle = this.interferencePattern;
			this.ctx.fillRect(0, 0.075 * this.H, width, 0.55 * this.H);

			this.interferenceOpacity -= 0.08;
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

	drawDialogBackground()
	{
		this.ctx.save();

		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
		this.ctx.fillRect(0, this.H * 0.69, this.W, this.H * 0.31);

		this.ctx.fillStyle = this.gradients[this.speakerIsProtagonist ? 'nameprotagLeft' : 'nametagLeft'];
		this.ctx.fillRect(0, this.H * 0.63, this.W, this.H * 0.06);

		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, this.H * 0.693, this.W, this.H * 0.02);

		this.ctx.fillStyle = '#FF0066';
		this.ctx.fillRect(0, this.H * 0.713, this.W, this.H * 0.01);

		this.ctx.restore();
	}

	draw(time)
	{
		this.ctx.clearRect(0, 0, this.W, this.H);

		this.drawClassTrialBanner();
		this.drawDialogBackground();

		if (this.speakerId != NARRATOR)
			this.drawSpeakerCard();

		this.dialogue.draw();

		if (this.nametag.marginLeft > 0)
			this.nametag.marginLeft -= 0.005 * this.W;
		if (this.nametag.opacity < 1)
			this.nametag.opacity += 0.1;
		this.nametag.draw();
	}
}

DiscussionScreen.COLOR_NARRATOR = '#47FF19';
DiscussionScreen.COLOR_CHARACTER = 'white';

export default DiscussionScreen