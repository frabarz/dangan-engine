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
		throw new Error('Stage.Render: Not implemented.');
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