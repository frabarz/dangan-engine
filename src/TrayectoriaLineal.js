import Trayectoria from './Trayectoria.js';

export default class TrayectoriaLineal extends Trayectoria
{
	constructor(start, end)
	{
		super();

		this.ax = start.x;
		this.ay = start.y;
		this.az = start.z;

		this.dx = end.x - start.x;
		this.dy = end.y - start.y;
		this.dz = end.z - start.z;

		start = null;
		end = null;
	}

	getX(t)
	{
		return this.ax + t * this.dx;
	}

	getY(t)
	{
		return this.ay + t * this.dy;
	}

	getZ(t)
	{
		return this.az + t * this.dz;
	}
}