import HUDElement from './HUDElement.js';

export default class HUD
{
    constructor(width, height)
    {
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		canvas.width = width;
		canvas.height = height;

		this.W = width;
		this.H = height;

		this.ctx = ctx;
		this.canvas = canvas;

		this.children = [];

		ctx = canvas = null;
	}
    
    // Shamelessly stolen from THREE.js
	add(object)
    {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++)
				this.add(arguments[i]);

			return this;
		};

		if (object === this) {
			console.error("HUD.add: object can't be added as a child of itself.", object);
			return this;
		}

		if (object instanceof HUDElement) {
			if (object.parent !== undefined) {
				object.parent.remove(object);
			}

			object.parent = this;
			object.dispatchEvent({'type': 'added'});

			this.children.push(object);
		}

		else {
			console.error("HUDElement.add: object not an instance of HUDElement.", object);
		}

		return this;
	}

	remove(object)
    {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++)
				this.remove(arguments[i]);
		};

		var index = this.children.indexOf(object);

		if (index !== -1) {
			object.parent = undefined;
			object.dispatchEvent({'type': 'removed'});
			this.children.splice(index, 1);
		}
	}
    
    getChildrenByType(type)
    {
        var result = [],
            n = this.children.length;
        
        while (n--) 
        {
            if (this.children[n].type == type)
                result.push(this.children[n]);
            
            if (this.children[n].children.length > 0)
                result = result.concat(this.children[n].getChildrenByType(type));
        }
        
        return result;
    }

	clear()
    {
		this.ctx.clearRect(0, 0, this.W, this.H);
	}

	blackScreen(opacity)
    {
		this.ctx.clearRect(0, 0, this.W, this.H);
		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
		this.ctx.rect(0, 0, this.W, this.H);
		this.ctx.fill();
	}
    
    draw(t)
    {
        var n = this.children.length;
        
        while (n--)
        {
            this.children[n].draw(t);
        }
    }
}