/* global Animacion */
(function (DR) {
	"use strict";

	function NSD(trial, config) {
		this.bullets = config.bullets;
		this.statements = config.statements;
		this.trial = trial;

		this.cylinder = new DR.HUD.Cylinder(trial.hud.ctx);
		this.cylinder.bullets = config.bullets.map(function (texto, i) {
			return new DR.HUD.Bullet(texto, i, trial.hud.ctx);
		});
		this.cylinder.setScale();
	}

	NSD.prototype.start = function () {
		return Promise.resolve(this.trial)
			.then(transitionFromCurrentState.bind(this))
			.then(stagePresentation.bind(this))
			.then(presentBullets.bind(this))
			.then(loadStatements.bind(this));
	};

	NSD.prototype.then = function (stage) {
		return new Promise(stage.bind(this));
	};

	function transitionFromCurrentState() {
		if (this.trial.stage == DR.Trial.STAGE_TUTORIAL)
			return new Promise(transitionFromTutorial.bind(this));
	}

	function transitionFromTutorial(reject, resolve) {
		var inicio,
			trial = this.trial,
			start = Math.PI + new Coordenada(trial.mainCamera.position).p;

		trial.mainCamera.up.set(0, 0, 1);
		cancelAnimationFrame(Animacion.cuadro);

		function transition(now) {
			var delta = (now - inicio) / 1000,
				angle = start - (delta * Math.PI),
				sin = Math.sin(angle),
				cos = Math.cos(angle);

			trial.mainCamera.position.set(-28 * cos, -28 * sin, 33 - (delta * 7));
			trial.mainCamera.lookAt(new THREE.Vector3(19 * cos, 19 * sin, 9));

			if (delta > 1)
				trial.hud.blackScreen(delta - 1);

			trial.render();

			if (delta < 2)
				Animacion.cuadro = requestAnimationFrame(transition);
			else {
				trial.hud.clear();
				resolve(trial);
			}
		};

		trial.hud.clear();
		inicio = ('performance' in window ? performance.now() : Date.now());
		transition(inicio);
	}

	function stagePresentation(trial) {
		return new Promise(function (resolve, reject) {
			var start,
				tiempo = 3500;

			function transition(ahora) {
				var avance = Math.min(1, (ahora - start) / tiempo),
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
					Animacion.step(transition);
				} else {
					trial.hud.clear();
					resolve(trial);
				}
			};

			Animacion.stop();
			start = ('performance' in window ? performance.now() : Date.now());
			transition(start);
		});
	};

	function presentBullets(trial) {
		debugger;
		var cylinder = this.cylinder;
		return new Promise(function (resolve, reject) {
			var start = 0,
				start_angle = Math.random() * 2 * Math.PI;

			function transition(now) {
				var sin, cos,
					time = (now - start) / 1000,
					angle = start_angle + time * 0.1 * Math.PI;

				sin = Math.sin(angle);
				cos = Math.cos(angle);

				trial.mainCamera.position.set(8 * cos, 8 * sin, 16);
				trial.mainCamera.up.set(0.1 * sin, -0.1 * cos, 1);
				trial.mainCamera.lookAt(new THREE.Vector3(20 * cos, 20 * sin, 16));

				sin = cylinder.renderBulletPresentation(time);

				trial.render();

				if (sin) {
					trial.hud.clear();
					resolve(trial);
				} else
					Animacion.cuadro = requestAnimationFrame(transition);
			};

			cancelAnimationFrame(Animacion.cuadro);
			start = ('performance' in window ? performance.now() : Date.now());
			transition(start);
		});
	};

	function loadStatements() {

	}

	Object.defineProperty(Animacion, 'NSD', {
		value: NSD,
		writable: false
	});

})(window.DR || (window.DR = {}));