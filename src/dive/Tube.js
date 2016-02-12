import Ring from './Ring.js';

export default class Tube extends THREE.Object3D
{
	constructor(radius, length, segments)
	{
		super();

		let depth = length / segments;

		this.speed = new THREE.Vector3();

		this.parameters = {
			radius: radius,
			depth: depth,
			segments: segments
		};

		while (segments--)
		{
			let ring = new Ring(radius, depth);
			ring.position.z = segments * depth;
			this.add(ring);
		}
	}

	raycastPlates(ray)
	{
		let plate,
			r = this.children.length;

		while (r--) {
			plate = this.children[r].raycastPlates(ray);

			if (plate)
				return plate;
		}
	}
}
