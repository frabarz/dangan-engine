import Coordenada from './../Coordenada.js';
import Animation from './../Animation.js';

export default class NSDAnimation extends Animation
{
	constructor(trial) {
		super(trial);
	}

	introNSD() {
		var trial = this.trial;

		this.promise = this.promise
			.then(function() {
				return new Promise(function (resolve, reject) {
					var transition, start;

					transition = function (ahora) {
						var avance = Math.min(1, (ahora - start) / 3500),
							angle = (avance - 0.25) * 2.125 * Math.PI;

						trial.mainCamera.position.set(
							(56 - 46 * Math.pow(avance, 2)) * Math.cos(angle),
							(56 - 46 * Math.pow(avance, 2)) * Math.sin(angle),
							35 - 18 * avance
							);

						trial.mainCamera.up.set(
							0.16 * (1 - avance) * Math.sin(angle),
							-0.16 * (1 - avance) * Math.cos(angle),
							1
							);

						trial.mainCamera.lookAt(new THREE.Vector3(
							0,
							0,
							10 + avance * 6
							));

						if (avance < 0.3)
							trial.hud.blackScreen((0.3 - avance) / 0.3);

						trial.render();

						if (avance < 1) {
							Animation.cuadro = requestAnimationFrame(transition);
						} else {
							trial.hud.clear();
							resolve();
						}
					};

					cancelAnimationFrame(Animation.cuadro);
					start = performance.now();
					transition(start);
				});
			});

		return this;
	}

	presentBullets(bullets)
	{
		var trial = this.trial;

		this.promise = this.promise
			.then(function() {
				return new Promise(function (resolve, reject) {
					var transition,
						start = 0,
						start_angle = Math.random() * 2 * Math.PI;

					var cylinder = trial.hud.getChildByType('HUD.Cylinder');

					transition = function (time) {
						var angle = start_angle + (time - start) / 1000 * 0.1 * Math.PI,
							sin = Math.sin(angle),
							cos = Math.cos(angle);

						trial.mainCamera.position.set(8 * cos, 8 * sin, 16);
						trial.mainCamera.up.set(0.1 * sin, -0.1 * cos, 1);
						trial.mainCamera.lookAt(new THREE.Vector3(20 * cos, 20 * sin, 16));

						trial.render(time);

						if (cylinder.draw(time)) {
							trial.hud.clear();
							resolve();
						} else
							Animation.cuadro = requestAnimationFrame(transition);
					};

					cancelAnimationFrame(Animation.cuadro);
					start = performance.now();
					transition(start);
				});
			});

		return this;
	};
}