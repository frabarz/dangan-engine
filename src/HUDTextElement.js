import HUDElement from './HUDElement.js';

export default class HUDTextElement extends HUDElement
{
    constructor(ctx, text, speaker)
    {
        super(ctx);

        this.type = 'HUDTextElement';

        this.text = text;
    }
    
    set speaker(entity)
    {
        if (entity == 'narrator')
            this.color = '#47FF19';
        else
            this.color = 'white';
    }

    draw(t)
    {
        this.ctx.save();
        
        this.ctx.fillStyle = this.color;
        this.ctx.font = (0.06 * this.H) + 'px Calibri';
        this.writeLine(this.ctx, this.H * 0.8, this.W * 0.94);
        
        this.ctx.restore();
    }

    writeLine(ctx, y, width)
    {
        var text = this.text,
            lastWord = '',
            size = this.ctx.measureText(text).width,
            currentLine = text.split(' '),
            nextLine = [];

        while (size > width) {
            lastWord = currentLine.pop();
            nextLine.unshift(lastWord);
            text = currentLine.join(' ');
            size = this.ctx.measureText(text).width;
        }

        if (currentLine.length > 0) {
            ctx.fillText(text, this.W * 0.03, y);
            if (nextLine.length > 0)
                this.writeLine(nextLine.join(' '), y + this.H * 0.08);
        } else {
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
