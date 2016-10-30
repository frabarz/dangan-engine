import Trayectoria from './Trayectoria.js';

export default class TrayectoriaEsferica extends Trayectoria
{
	constructor(start, end, center)
	{
		super(start, end);

		center = center || {};

		this.cx = center.x || 0;
		this.cy = center.y || 0;
		this.cz = center.z || 0;

		this.ax = start.x - this.cx;
		this.ay = start.y - this.cy;
		this.az = start.z - this.cz;

		this.ar = Math.sqrt(this.ax * this.ax + this.ay * this.ay + this.az * this.az);
		this.ap = Math.atan2(this.ay, this.ax);
		this.at = Math.acos(this.az / Math.sqrt(this.ax * this.ax + this.ay * this.ay + this.az * this.az));


		this.bx = end.x - this.cx;
		this.by = end.y - this.cy;
		this.bz = end.z - this.cz;

		this.br = Math.sqrt(this.bx * this.bx + this.by * this.by + this.bz * this.bz);
		this.bp = Math.atan2(this.by, this.bx);
		this.bt = Math.acos(this.bz / Math.sqrt(this.bx * this.bx + this.by * this.by + this.bz * this.bz));

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
		if (this.path == 'spherical')
			return this.cx + this.getR(t) * Math.sin(this.getT(t)) * Math.cos(this.getP(t));

		if (this.path == 'circular')
			return this.cx + this.getR(t) * Math.cos(this.getP(t));

		return (1 - t) * this.ax + t * this.bx;
	}

	getY(t)
	{
		if (this.path == 'spherical')
			return this.cy + this.getR(t) * Math.sin(this.getT(t)) * Math.sin(this.getP(t));

		if (this.path == 'circular')
			return this.cy + this.getR(t) * Math.sin(this.getP(t));

		return (1 - t) * this.ay + t * this.by;
	}

	getZ(t)
	{
		if (this.path == 'spherical')
			return this.cz + this.getR(t) * Math.cos(this.getT(t));

		return (1 - t) * this.az + t * this.bz;
	}

	getR(t)
	{
		return (1 - t) * this.ar + t * this.br;
	}

	getP(t)
	{
		return (1 - t) * this.ap + t * this.bp;
	}

	getT(t)
	{
		return (1 - t) * this.at + t * this.bt;
	}
}