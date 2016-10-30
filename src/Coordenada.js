class Coordenada
{
	constructor(x, y, z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	get r()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y + (this.spherical ? this.z * this.z : 0));
	}
	set r(r)
	{
		if (this.spherical)
			this.setSpherical(r, this.t, this.p);
		else
			this.setPolar(r, this.p);
	}

	get t()
	{
		return Math.acos(this.z / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
	}
	set t(t)
	{
		this.setSpherical(this.r, t, this.p);
	}

	get p()
	{
		return Math.atan2(this.y, this.x);
	}
	set p(p)
	{
		if (this.spherical)
			this.setSpherical(this.r, this.t, p);
		else
			this.setPolar(this.r, p);
	}

	get vector3()
	{
		return new THREE.Vector3(this.x, this.y, this.z);
	}

	toString()
	{
		return "{x:" + this.x + ", y:" + this.y + ", z: " + this.z + "}";
	}

	setSpherical(r, t, p)
	{
		// t: inclinación, 0°-180°
		// p: azimuth, 0°-360°

		this.x = r * Math.sin(t) * Math.cos(p);
		this.y = r * Math.sin(t) * Math.sin(p);
		this.z = r * Math.cos(t);
	}

	setPolar(r, p, z)
	{
		this.x = r * Math.cos(p);
		this.y = r * Math.sin(p);
		this.z = isFinite(z) ? z : this.z;
	}
}

Coordenada.parse = function (input)
{
	if (input instanceof this)
		return input;

	else if (input.hasOwnProperty('x'))
		return new this(input.x, input.y, input.z);

	else if (input.hasOwnProperty('t')) {
		let point = new this();
		point.spherical = true;
		point.setSpherical(input.r, input.t, input.p);
		return point;
	}

	else if (input.hasOwnProperty('p')) {
		let point = new this();
		point.setPolar(input.r, input.p, input.z);
		return point;
	}

	else if (Array.isArray(input))
		return new this(input[0], input[1], input[2]);

	else
		throw new Error("Coordenada.parse: Couldn't parse input.");
}

export default Coordenada