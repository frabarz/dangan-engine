import HUDInterface from './HUDInterface.js';
import HUDTextElement from './HUDTextElement.js'

class HUDDiscussionInterface extends HUDInterface
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
				labels: {
					discussionProtag: protagDiscLeft,
					discussionLeft: labelDiscLeft,
					discussionRight: labelDiscRight
				}
			};
		})();
        
        this.textElement = new HUDTextElement(ctx);
        this.add(this.textElement);
	}
    
    setText(text)
    {
        this.textElement.text = text;
    }
    
    setSpeaker(entity)
    {
        this.textElement.speaker = entity;
    }
	
    drawBackground()
    {
		this.ctx.clearRect(0, 0, this.W, this.H);

		this.ctx.save();

		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
		this.ctx.fillRect(0, this.H * 0.68, this.W, this.H * 0.32);

		this.ctx.beginPath();
		this.ctx.rect(0, this.H * 0.62, this.W, this.H * 0.06);
		this.ctx.fillStyle = this.gradients.labels.discussionLeft;
		this.ctx.fill();

		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, this.H * 0.68, this.W, this.H * 0.02);

		this.ctx.fillStyle = '#FF0066';
		this.ctx.fillRect(0, this.H * 0.7, this.W, this.H * 0.01);

		this.ctx.restore();
	}
    
    drawDialogue(text)
    {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.font = (0.06 * h) + 'px Calibri';
        writeLine(text, h * 0.8, w * 0.94);
        this.ctx.restore();
	}
    
    draw()
    {
        this.drawBackground();
        
        
    }
}

HUDDiscussionInterface.COLOR_NARRATOR = '#47FF19';
HUDDiscussionInterface.COLOR_CHARACTER = 'white';

export default HUDDiscussionInterface