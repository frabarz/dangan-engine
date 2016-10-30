import Stage from './Stage.js';

import DiscussionAnimation from './animation/DiscussionAnimation.js';
import DiscussionScreen from './hud/DiscussionScreen.js';

export default class DiscussionStage extends Stage
{
	constructor(trial)
	{
		super(trial);

		this.screen = new DiscussionScreen(this.hudRenderer.ctx);
		this.hudRenderer.screen = this.screen;

		this.animation = new DiscussionAnimation(trial.renderer);
	}

	render(time)
	{
		this.sceneRenderer && this.sceneRenderer.render(time);
		this.hudRenderer && this.hudRenderer.render(time);
		this.audioRenderer && this.audioRenderer.render(time);
	}

	promiseChainForDialogue(speaker, lines, thought)
	{
		let promise = Promise.resolve(true);

		for (let line, i = 0; line = lines[i]; i++) {
			promise = promise.then(function () {
				this.screen.setDialogue(this.characters[speaker], line, thought);

				return new Promise(function (resolve) {
					setTimeout(resolve, Math.max(2500, line.length * 50));
					line = null;
					i = null;
				});
			}.bind(this));
		}

		return promise;
	}

	queueNarratorScript(block)
	{
		this.eventchain = this.eventchain.then(function () {
			let promises = [];

			promises[0] = this.promiseChainForDialogue(block.speaker, block.dialogue);
			this.animation.tutorial();

			return Promise.all(promises);
		}.bind(this));
	}

	queueCharacterScript(block)
	{
		this.eventchain = this.eventchain.then(function () {
			let promises = [];

			promises[0] = this.promiseChainForDialogue(block.speaker, block.dialogue, block.thought);

			if ('sprite' in block)
				this.characters[block.speaker].sprite = block.sprite;

			promises[1] = Promise.resolve();

			if ('camera' in block)
				promises[1] = promises[1].then(function () {
					return this.animation.cutTo(block.camera);
				}.bind(this));

			if ('animation' in block) {
				for (let i = 0; i < block.animation.length; i++) {
					promises[1] = promises[1].then(function () {
						return this.animation.transicion(block.animation[i]);
					}.bind(this));
				}
			}

			return Promise.all(promises);
		}.bind(this));
	}
}