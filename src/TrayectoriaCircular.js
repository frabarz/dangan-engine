import Trayectoria from './Trayectoria.js';

export default class TrayectoriaCircular extends Trayectoria
{
	constructor(start, end, center)
	{
		super();

		center = center || {};

		this.cx = center.x || 0;
		this.cy = center.y || 0;

		this.ax = start.x - this.cx;
		this.bx = end.x - this.cx;

		this.ay = start.y - this.cy;
		this.by = end.y - this.cy;

		this.az = start.z;
		this.dz = end.z - start.z;

		this.ar = Math.sqrt(this.ax * this.ax + this.ay * this.ay);
		this.br = Math.sqrt(this.bx * this.bx + this.by * this.by);

		this.ap = Math.atan2(this.ay, this.ax);
		this.bp = Math.atan2(this.by, this.bx);

		// Shortest path fix
		if (this.bp - this.ap > Math.PI)
			this.ap += 2 * Math.PI;
		else if (this.bp - this.ap < -Math.PI)
			this.bp += 2 * Math.PI;

		start = null;
		end = null;
		center = null;
	}

	getX(t)
	{
		return this.cx + this.getR(t) * Math.cos(this.getP(t));
	}

	getY(t)
	{
		return this.cy + this.getR(t) * Math.sin(this.getP(t));
	}

	getZ(t)
	{
		return this.az + t * this.dz;
	}

	getR(t)
	{
		return (1 - t) * this.ar + t * this.br;
	}

	getP(t)
	{
		return (1 - t) * this.ap + t * this.bp;
	}
}
