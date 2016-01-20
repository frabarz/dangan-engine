import Coordenada from './Coordenada.js';

import EASE from './easing.js';
import INTERPRETE from './interprete.js';

class Animation
{
	constructor(trial)
	{
		this.trial = trial;
		this.promise = Promise.resolve(true);
	}

	stop()
	{
		cancelAnimationFrame(Animation.cuadro);
	}

	delay(time)
	{
		this.promise = this.promise.then(function () {
			return new Promise(function(resolve, reject) {
				setTimeout(resolve, time);
			});
		});

		return this;
	}

	loadScript(script)
	{
		var self = this;
		script.forEach(function (item) {
			if ('sprite' in item)
				self.changeSprite(item.character, item.sprite);

			self.transicion(item);
		});

		return this;
	}

	changeSprite(persona, sprite)
	{
		this.trial.characters[persona].changeSprite(sprite);
		return this;
	}

	cortarHacia(newcam)
	{
		var trial = this.trial;
		this.promise = this.promise.then(function () {
			cancelAnimationFrame(Animation.cuadro);

			if ('fov' in newcam) {
				trial.mainCamera.fov = newcam.fov;
				trial.mainCamera.updateProjectionMatrix();
			}

			if ('up' in newcam)
				trial.mainCamera.up.copy(newcam.up);

			if ('position' in newcam)
				trial.mainCamera.position.copy(newcam.position);

			if ('lookat' in newcam)
				trial.mainCamera.lookAt(newcam.lookat.vectorThree);

			trial.render();
		});

		return this;
	}

	transicion(param)
	{
		param.trial = this.trial;
		this.promise = this.promise.then(function () {
			var trial = param.trial,
				duration = param.duration || 10,
				easing = EASE[param.easing] || EASE.linear,
				delta = {};

			if ('fov' in param)
				delta.fov = new INTERPRETE.FOV(param);

			if ('up' in param)
				delta.up = new INTERPRETE.Up(param);

			if ('position' in param)
				delta.position = new INTERPRETE.Position(param);

			if ('lookat' in param)
				delta.lookat = new INTERPRETE.LookAt(param);

			param = null;

			return new Promise(function (resolve, reject) {
				var inicio;

				function transicion(now) {
					var avance = Math.min(1, (now - inicio) / duration),
						recorrido = easing(avance);

					if ('fov' in delta)
						delta.fov.apply(recorrido);

					if ('up' in delta)
						delta.up.apply(recorrido);

					if ('position' in delta)
						delta.position.apply(recorrido);

					if ('lookat' in delta)
						delta.lookat.apply(recorrido);

					trial.render();

					if (avance < 1) {
						Animation.cuadro = requestAnimationFrame(transicion);
					} else {
						delta = easing = duration = null;
						inicio = now = null;
						avance = recorrido = null;
						resolve();
					}
				}

				cancelAnimationFrame(Animation.cuadro);
				inicio = window.performance.now();
				transicion(inicio);
			});
		});

		return this;
	}
}

Object.defineProperties(Animation, {
	cuadro: {
		value: 0,
		writable: true
	},

	step: {
		value: function (step) {
			this.cuadro = requestAnimationFrame(step);
		},
		writable: false
	}
});

export default Animation