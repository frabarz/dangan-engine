import Coordenada from './Coordenada.js';
import Videographer from './Videographer.js';

class Animation
{
	constructor(renderers)
	{
		this.scene = renderers.scene;
		this.hud = renderers.hud;
	}

	cutTo(param)
	{
		return new Promise(function (end) {
			this.processor = function() {
				if ('fov' in param) {
					this.mainCamera.fov = param.fov;
					this.mainCamera.updateProjectionMatrix();
				}

				if ('position' in param)
					this.mainCamera.position.copy(Coordenada.parse(param.position));

				if ('up' in param)
					this.mainCamera.up.copy(Coordenada.parse(param.up));

				if ('direction' in param)
					this.mainCamera.lookAt(Coordenada.parse(param.direction));

				this.processor = null;
				param = null;
				end();
			};
		}.bind(this.scene));
	}

	transicion(param)
	{
		if ('preset' in param)
			return this[param.preset](param);

		return new Promise(function (end) {
			var bp = new Videographer(param.duration || 6000, param.path, param.easing);

			if ('fov' in param)
				bp.setupFOV(
					param.fov.start || this.mainCamera.fov,
					param.fov.end || param.fov,
					param.fov
				);

			if ('position' in param)
				bp.setupPosition(
					param.position.start || this.mainCamera.position,
					param.position.end || param.position,
					param.position
				);

			if ('up' in param)
				bp.setupUp(
					param.up.start || this.mainCamera.up,
					param.up.end || param.up,
					param.up
				);

			if ('direction' in param)
				bp.setupDirection(
					param.direction.start || new THREE.Vector3(0, 0, -10).applyMatrix4(this.mainCamera.matrixWorld),
					param.direction.end || param.direction,
					param.direction
				);

			param = null;

			this.processor = function (now) {
				const avance = bp.delta(now);

				bp.runStage(this.mainCamera, avance);

				if (avance > 1) {
					this.processor = null;
					bp = null;

					end();
				}
			};
		}.bind(this.scene));
	}
}

export default Animation