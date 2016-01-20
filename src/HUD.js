import BaseElement from './hud/Element.js';

import DiscussionScreen from './hud/DiscussionScreen.js';
import NSDScreen from './hud/NSDScreen.js';

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

		this.blackScreen = 0;

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

		if (object instanceof BaseElement) {
			if (object.parent !== undefined) {
				object.parent.remove(object);
			}

			object.parent = this;
			object.dispatchEvent({'type': 'added'});

			this.children.push(object);
		}

		else {
			console.error("HUD.add: object not an instance of HUDElement.", object);
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

	setScreen(mode)
	{
		this.getChildrenByType('HUD.Screen').forEach(this.remove, this);

		switch(mode) {
			case 'nsd':
				screen = new NSDScreen(this.ctx);
				break;

			case 'discussion':
			default:
				screen = new DiscussionScreen(this.ctx);
				break;
		}

		this.add(screen);

		return screen;
	}

	clear()
	{
		this.ctx.clearRect(0, 0, this.W, this.H);
	}

	drawBlackScreen(opacity)
	{
		this.ctx.save();

		console.log(this.blackScreen);

		this.globalAlpha = this.blackScreen;
		this.ctx.fillStyle = '#000000';
		this.ctx.fillRect(0, 0, this.W, this.H);

		this.ctx.restore();
	}

	draw(t)
	{
		this.ctx.clearRect(0, 0, this.W, this.H);

		var n = this.children.length;
		while (n--)
		{
			this.children[n].draw(t);
		}

		if (this.blackScreen > 0)
			this.drawBlackScreen();
	}
}