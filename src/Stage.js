/*
 * class STAGE
 *
 * The Stage object holds and controls all the children elements involved in the game.
 * Is composed, but not limited to, by
 * - a Scene Renderer: in this case, the Three.js WebGL Renderer,
 * - a HUD Renderer: can be the one included or a custom one,
 * - an Audio Renderer: work in progress
 *
 * Each stage of the game is controlled by a different subclass of this class, and will be switched
 * depending on the game's script.
 *
 * All the Renderers must have the same structure as a Three.js Renderer; a render() method
 * must be available to be called on every frame.
 *
 */

export default class Stage
{
	constructor(trial)
	{
		this.characters = trial.characters;

		this.trial = trial;

		this.sceneRenderer = trial.renderer.scene;
		this.hudRenderer = trial.renderer.hud;
		this.audioRenderer = trial.renderer.audio;

		this.eventchain = Promise.resolve();
		this._func = [];

		this.cuadro = 0;
	}

	render(time)
	{
		throw new Error('Stage.render: Not implemented.');
	}

	stop()
	{
		cancelAnimationFrame(this.cuadro);
		return this;
	}

	step(func)
	{
		this.cuadro = requestAnimationFrame(func.bind(this));
		return this;
	}

	justKeepRendering()
	{
		const transition = function(time) {
			this.render(time);
			this.cuadro = requestAnimationFrame(transition);
		}.bind(this);

		this.cuadro = requestAnimationFrame(transition);
	}

	next(func)
	{
		this.eventchain = this.eventchain.then(func.bind(this));
		return this;
	}

	nextPromise(func)
	{
		this.eventchain = this.eventchain.then(function () {
			return new Promise(func.bind(this));
		}.bind(this));

		return this;
	}

	delayPromise(time)
	{
		return new Promise(function(resolve) {
			setTimeout(resolve, time);
		});
	}

	end(nextStage)
	{
		return this.eventchain
			.then(function() {
				return this.animation.exitSpin();
			}.bind(this))
			.then(function() {
				this.trial.changeStage(nextStage.kind);
				this.trial.loadScript(nextStage.file);
			}.bind(this));
	}
}