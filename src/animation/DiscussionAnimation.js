import Coordenada from './../Coordenada.js';
import Trayectoria from './../Trayectoria.js';
import Animation from './../Animation.js';

export default class DiscussionAnimation extends Animation
{
	constructor(renderers)
	{
		super(renderers);
	}

	randomDialogue()
	{
		var transition,
			inicio,
			dir_x, dir_y,
			char = juicio.characters[Object.keys(juicio.characters)[Math.floor(Math.random() * 15)]],
			counter = char.card.counter;

		screen.setDialogue(char, 'I actually looked at the crime scene for more than 2 seconds, something you should try to do sometimes...');

		juicio.mainCamera.up.x = (Math.random() - 0.5) / 2;
		juicio.mainCamera.up.z = 5;
		juicio.mainCamera.up.normalize();

		dir_x = 0.5 * (Math.random() - 0.5);
		dir_y = 10 * (Math.random() - 0.5);

		transition = function (t) {
			var delta = (t - inicio) / 10000,
				ang = 2 * Math.PI * (counter + dir_x * delta) / 16;

			juicio.mainCamera.position.set(
				(9 + dir_y * delta) * Math.cos(ang),
				(9 + dir_y * delta) * Math.sin(ang),
				16
				);

			juicio.mainCamera.lookAt({
				x: 25 * Math.cos(ang),
				y: 25 * Math.sin(ang),
				z: 16
			});

			juicio.render(t);
			Animation.step(transition);
		}

		juicio.animation.stop();
		inicio = window.performance.now() + 5000;
		Animation.step(transition);
	}

	tutorial()
	{
		return new Promise(function (end) {
			this.mainCamera.up.set(0, 0, 1);
			this.mainCamera.fov = 40;
			this.mainCamera.updateProjectionMatrix();

			this.processor = function (now) {
				let angle = 2 * Math.PI * (now % 60000) / 60000;

				// pos: 28, 0, 33
				this.mainCamera.position.set(-28 * Math.cos(angle), -28 * Math.sin(angle), 33);
				// look: -19, 0, 9
				this.mainCamera.lookAt(new THREE.Vector3(19 * Math.cos(angle), 19 * Math.sin(angle), 9));
			};
		}.bind(this.scene));
	}

	cuestionamiento(param)
	{
		return this.cutTo({
			fov: 40,
			up: new Coordenada(0, 0, 1),
			position: Coordenada.parse({ r: 10, p: param.azimuth, z: 17 }),
			direction: Coordenada.parse({ r: 26, p: param.azimuth, z: 15 })
		})
		.then(function() {
			return this.transicion({
				fov: 54,
				duration: (param.duration || 600) * 4 / 7,
				position: Coordenada.parse({ r: 3, p: param.azimuth, z: 16 }),
				direction: Coordenada.parse({ r: 26, p: param.azimuth, z: 15 }),
				easing: 'outQuad'
			});
		}.bind(this))
		.then(function() {
			return this.transicion({
				fov: 60,
				duration: (param.duration || 600) * 3 / 7,
				position: Coordenada.parse({ r: 10, p: param.azimuth, z: 17 }),
				direction: Coordenada.parse({ r: 26, p: param.azimuth, z: 15 }),
				easing: 'inCubic'
			});
		}.bind(this));
	}

	exitSpin()
	{
		return new Promise(function (end) {
			var inicio,
				initial_up = Coordenada.parse(this.scene.mainCamera.up),
				initial_pos = Coordenada.parse(this.scene.mainCamera.position),
				initial_look = Coordenada.parse(new THREE.Vector3(0, 0, -10).applyMatrix4(this.scene.mainCamera.matrixWorld)),
				up = {
					r: initial_up.r,
					dp: initial_up.p - initial_pos.p,
					z: initial_up.z
				},
				look = {
					r: initial_look.r,
					dp: initial_look.p - initial_pos.p,
					z: initial_look.z
				};

			initial_look = null;
			initial_up = null;

			this.hud.processor = function (now) {
				let delta = (now - inicio) / 1000;

				if (delta >= 2) {
					this.processor = null;
					end();
				} else if (delta > 1)
					this.blackScreen = delta - 1;
				else
					this.blackScreen = 0;
			};

			this.scene.processor = function (now) {
				inicio || (inicio = now);

				let delta = (now - inicio) / 1000,
					angle = initial_pos.p - (delta * Math.PI);

				this.mainCamera.position.set(
					initial_pos.r * Math.cos(angle),
					initial_pos.r * Math.sin(angle),
					initial_pos.z * (1 - delta / 2) + 19 * delta / 2
					);
				this.mainCamera.lookAt(new THREE.Vector3(
					look.r * Math.cos(angle + look.dp),
					look.r * Math.sin(angle + look.dp),
					look.z * (1 - delta / 2) + 19 * delta / 2
					));
				this.mainCamera.up.set(
					up.r * Math.cos(angle + up.dp),
					up.r * Math.sin(angle + up.dp),
					up.z
					);

				if (delta >= 2) {
					inicio = null;
					initial_pos = null;
					this.processor = null;
				}
			};
		}.bind(this));
	}
}