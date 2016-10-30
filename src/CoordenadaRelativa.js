import Coordenada from './Coordenada.js';

export default class CoordenadaRelativa extends Coordenada
{
	constructor(x, y, z, cx, cy, cz)
	{
		super(x, y, z);

		this.cx = cx || 0;
		this.cy = cy || 0;
		this.cz = cz || 0;
	}

	get relative_x()
	{
		return this.x - this.cx;
	}
	set relative_x(x)
	{
		this.x = this.cx + x;
	}

	get relative_y()
	{
		return this.y - this.cy;
	}
	set relative_y(y)
	{
		this.y = this.cy + y;
	}

	get relative_z()
	{
		return this.z - this.cz;
	}
	set relative_z(z)
	{
		this.z = this.cz + z;
	}

	get relative_r()
	{
		let x = this.x - this.cx,
			y = this.y - this.cy,
			z = this.z - this.cz;

		return Math.sqrt(x * x + y * y + (this.spherical ? z * z : 0));
	}

	setSpherical(r, t, p)
	{
		// t: inclinación, 0°-180°
		// p: azimuth, 0°-360°

		this._x = this.cx + r * Math.sin(t) * Math.cos(p);
		this._y = this.cy + r * Math.sin(t) * Math.sin(p);
		this._z = this.cz + r * Math.cos(t);
	}

	setPolar(r, p)
	{
		this._x = this.cx + r * Math.cos(p);
		this._y = this.cy + r * Math.sin(p);
	}
}