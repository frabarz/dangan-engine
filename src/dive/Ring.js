import Plate from './Plate.js';

export default class Ring extends THREE.Object3D
{
	constructor(radius, depth)
	{
		super();

		this.parameters = {
			radius: radius,
			depth: depth
		};

		let width = 2 * radius * Math.tan(15 / 360 * 2 * Math.PI);

		for (let i = 0; i < 12; i++) {
			let plate = new Plate(width, depth);

			plate.rotation.z = (3 + i) / 12 * 2 * Math.PI;
			plate.rotation.order = "ZXY";

			plate.position.x = -radius * Math.cos(i / 12 * 2 * Math.PI);
			plate.position.y = -radius * Math.sin(i / 12 * 2 * Math.PI);

			this.add(plate);
		}
	}

	raycastPlates(ray)
	{
		let plate,
			r = this.children.length;

		while (r--) {
			plate = this.children[r].raycast(ray);

			if (plate)
				return plate;
		}
	}
}