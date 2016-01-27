import Coordenada from './Coordenada.js';

import TrayectoriaLineal from './TrayectoriaLineal.js';
import TrayectoriaCircular from './TrayectoriaCircular.js';
import TrayectoriaEsferica from './TrayectoriaEsferica.js';

import EASE from './easing.js';

export default class Videographer
{
	constructor(duration, path, easing)
	{
		this.duration = duration;
		this.path = path || 'linear';
		this.easing = easing || 'linear';
	}

	getPosition(time)
	{
		return this.position.getVector( this.position.easing(time) );
	}

	getDirection(time)
	{
		return this.direction.getVector( this.direction.easing(time) );
	}

	getFOV(time)
	{
		return this.fov.start + this.fov.delta * this.fov.easing(time);
	}

	getUp(time)
	{
		return this.up.getVector( this.up.easing(time) );
	}

	setupPosition(start, end, params)
	{
		switch (params.path || this.path)
		{
			case 'circular':
				this.position = new TrayectoriaCircular(
					Coordenada.parse(start),
					Coordenada.parse(end),
					params.center
					);
				break;

			case 'spherical':
				this.position = new TrayectoriaEsferica(
					Coordenada.parse(start),
					Coordenada.parse(end),
					params.center
					);
				break;

			case 'linear':
			default:
				this.position = new TrayectoriaLineal(
					Coordenada.parse(start),
					Coordenada.parse(end)
					);
				break;
		}

		this.position.easing = EASE[params.easing || this.easing];

		params = null;
	}

	setupDirection(start, end, params)
	{
		switch (params.path || this.path)
		{
			case 'circular':
				this.direction = new TrayectoriaCircular(
					Coordenada.parse(start),
					Coordenada.parse(end),
					params.center
					);
				break;

			case 'spherical':
				this.direction = new TrayectoriaEsferica(
					Coordenada.parse(start),
					Coordenada.parse(end),
					params.center
					);
				break;

			case 'linear':
			default:
				this.direction = new TrayectoriaLineal(
					Coordenada.parse(start),
					Coordenada.parse(end)
					);
				break;
		}

		this.direction.easing = EASE[params.easing || this.easing];

		params = null;
	}

	setupFOV(start, end, params)
	{
		this.fov = {
			start: start,
			delta: end - start,
			easing: EASE[params.easing || this.easing]
		};

		params = null;
	}

	setupUp(start, end, params)
	{
		switch (params.path || this.path)
		{
			case 'circular':
				this.up = new TrayectoriaCircular(
					Coordenada.parse(start),
					Coordenada.parse(end),
					params.center
					);
				break;

			case 'spherical':
				this.up = new TrayectoriaEsferica(
					Coordenada.parse(start),
					Coordenada.parse(end),
					params.center
					);
				break;

			case 'linear':
			default:
				this.up = new TrayectoriaLineal(
					Coordenada.parse(start),
					Coordenada.parse(end)
					);
				break;
		}

		this.up.easing = EASE[params.easing || this.easing];

		params = null;
	}

	runStage(camera, time)
	{
		this.fov && (camera.fov = this.getFOV(time) ) && camera.updateProjectionMatrix();
		this.position && camera.position.copy( this.getPosition(time) );
		this.up && camera.up.copy( this.getUp(time) );
		// direction MUST be the last property to change
		this.direction && camera.lookAt( this.getDirection(time) );
	}

	delta(now)
	{
		this.start || (this.start = now);
		return (now - this.start) / this.duration;
	}
}