export default class HUDElement
{
	constructor(ctx)
	{
		this.type = 'HUD.Element';

		this.ctx = ctx;
		this.W = ctx.canvas.width;
		this.H = ctx.canvas.height;

		this.relative_x = 0;
		this.relative_y = 0;

		this.visible = true;
		this.opacity = 1;

		this.parent = undefined;
		this.children = [];

		this.events = {};
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
			console.error("HUD.Element$add: object can't be added as a child of itself.", object);
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
			console.error("HUD.Element$add: object not an instance of HUDElement.", object);
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

	getChildByType(type)
	{
		var result,
			i = 0,
			n = this.children.length;

		for (var i = 0; i < this.children.length; i++)
		{
			if (this.children[n].type == type)
			{
				return this.children[n];
			}

			if (this.children[n].children.length > 0)
			{
				result = this.children[n].getChildByType(type);

				if (result)
					return result;
			}
		}
	}

	dispatchEvent(object)
	{
		if (object.type in this.events)
		{
			this.events[object.type].forEach(function(callback) {
				callback(object);
			});
		}
	}

	listenEvent(type, callback)
	{
		if (!(type in this.events))
			this.events[type] = [];

		this.events[type].push(callback);
	}

	draw(t)
	{
		throw new Error('HUD.Element$draw: Method not implemented.', this.type);
	}
}
