DR.hud = (function () {
	"use strict";

	var w, h,
		canvas, ctx,
		gradients;

	function generateHUD(width, height) {
		canvas = document.createElement('canvas');
		canvas.id = 'hud';
		w = canvas.width = width;
		h = canvas.height = height;

		ctx = canvas.getContext('2d');

		gradients = (function() {
			var protagDiscLeft = ctx.createLinearGradient(0, 0, w, 0),
				labelDiscLeft = ctx.createLinearGradient(0, 0, w, 0),
				labelDiscRight = ctx.createLinearGradient(0, 0, w, 0);

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
	}

	function clearHUD() {
		ctx.clearRect(0, 0, w, h);
	}

	function blackScreen(opacity) {
		ctx.clearRect(0, 0, w, h);
		ctx.beginPath();
		ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
		ctx.rect(0, 0, w, h);
		ctx.fill();
	}

	function drawTrialDiscussion() {
		ctx.clearRect(0, 0, w, h);

		ctx.save();

		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
		ctx.fillRect(0, h * 0.68, w, h * 0.32);

		ctx.beginPath();
		ctx.rect(0, h * 0.62, w, h * 0.06);
		ctx.fillStyle = gradients.labels.discussionLeft;
		ctx.fill();

		ctx.fillStyle = 'white';
		ctx.fillRect(0, h * 0.68, w, h * 0.02);

		ctx.fillStyle = '#FF0066';
		ctx.fillRect(0, h * 0.7, w, h * 0.01);

		ctx.restore();
	}

	function writeLine(text, y, width) {
		var lastWord = '',
			size = ctx.measureText(text).width,
			currentLine = text.split(' '),
			nextLine = [];

		while (size > width) {
			lastWord = currentLine.pop();
			nextLine.unshift(lastWord);
			text = currentLine.join(' ');
			size = ctx.measureText(text).width;
		}

		if (currentLine.length > 0) {
			ctx.fillText(text, w * 0.03, y);
			if (nextLine.length > 0)
				writeLine(nextLine.join(' '), y + h * 0.08);
		} else {
			throw new Error('El texto contiene una palabra más ancha que el ancho máximo del canvas.');
		}

		lastWord = null;
		size = null;
		currentLine = null;
		nextLine = null;
	}

	return {
		generate: generateHUD,
		clear: clearHUD,
		get canvas() {
			return canvas;
		},
		get context() {
			return ctx;
		},
		blackScreen: blackScreen,
		trialDiscussion: drawTrialDiscussion,
		dialogue: function(text) {
			ctx.save();
			ctx.fillStyle = 'white';
			ctx.font = (0.06 * h) + 'px Calibri';
			writeLine(text, h * 0.8, w * 0.94);
			ctx.restore();
		},
		narrator: function(text) {
			ctx.save();
			ctx.fillStyle = '#47FF19';
			ctx.font = (0.06 * h) + 'px Calibri';
			writeLine(text, h * 0.8, w * 0.94);
			ctx.restore();
		}
	};
})();