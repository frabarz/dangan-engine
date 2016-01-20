import Coordenada from './../Coordenada.js';
import Animation from './../Animation.js';

export default class DiscussionAnimation extends Animation
{
	constructor(trial) {
		super(trial);
	}

	tutorial()
	{
		var inicio, transition,
			trial = this.trial;

		trial.mainCamera.up.set(0, 0, 1);
		trial.mainCamera.fov = 40;
		trial.mainCamera.updateProjectionMatrix();

		transition = function (now) {
			Animation.cuadro = requestAnimationFrame(transition);

			var angle = (now - inicio) / 1000 * 0.04 * Math.PI,
				sin = Math.sin(angle),
				cos = Math.cos(angle);

			angle = null;

			trial.mainCamera.position.set(-28 * cos, -28 * sin, 33);
			trial.mainCamera.lookAt(new THREE.Vector3(19 * cos, 19 * sin, 9));
			// look: -19, 0, 9
			// pos: 28, 0, 33

			sin = null;
			cos = null;

			trial.render(now);
		};

		this.promise = this.promise.then(function () {
			cancelAnimationFrame(Animation.cuadro);
			inicio = window.performance.now();
			transition(inicio);
		});

		return this;
	}

	cuestionamiento()
	{
		return this
			.cortarHacia({
				fov: 40,
				up: new Coordenada([0, 0, 1]),
				position: new Coordenada({ r: 3, p: 1.5707963267, z: 14 }),
				lookat: new Coordenada({ r: 19, p: 1.5707963267, z: 13 })
			})
			.transicion({
				duration: 600,
				position: new Coordenada({ r: 1, p: 1.5707963267, z: 14 }),
				lookat: new Coordenada({ r: 19, p: 1.5707963267, z: 13 }),
				easing: 'inOutQuad'
			})
			.transicion({
				duration: 600,
				fov: 60,
				position: new Coordenada({ r: 10, p: 1.5707963267, z: 15 }),
				lookat: new Coordenada({ r: 19, p: 1.5707963267, z: 13.4 }),
				easing: 'inOutQuad'
			});
	}

	exitSpin()
	{
		var trial = this.trial;

		this.promise = this.promise
			.then(function () {
				return new Promise(function (resolve) {
					var inicio, transition,
						start = new Coordenada(trial.mainCamera.position);

					trial.mainCamera.up.set(0, 0, 1);

					transition = function (now) {
						var delta = (now - inicio) / 1000,
							radius = start.r * (1 - delta / 2) + 28 * delta / 2,
							angle = Math.PI + start.p - (delta * Math.PI),
							sin = Math.sin(angle),
							cos = Math.cos(angle);

						trial.mainCamera.position.set(-radius * cos, -radius * sin, 33 - (delta * 7));
						trial.mainCamera.lookAt(new THREE.Vector3(19 * cos, 19 * sin, 9));

						if (delta > 1)
							trial.hud.blackScreen = delta - 1;

						trial.render(now);

						if (delta < 2)
							Animation.cuadro = requestAnimationFrame(transition);
						else {
							trial.hud.clear();
							resolve();
						}
					};

					Animation.stop();
					inicio = window.performance.now();
					transition(inicio);
				});
			});

		return this;
	}
}