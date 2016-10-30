import PlateBufferGeometry from './PlateBufferGeometry.js';

let geometry;

class Plate extends THREE.Mesh {
	constructor(width, length) {
		if (!geometry)
			geometry = new PlateBufferGeometry(width, length);

		super(geometry, Plate.materials.GREEN);

		this.behavior = this.constructor.GREEN;
	}

	changeType(type)
	{
		this.behavior = type || this.constructor.GREEN;

		switch (type) {
			case this.constructor.YELLOW:
				this.material = this.constructor.materials.YELLOW;
				break;

			case this.constructor.ACCELERATOR:
				this.material = this.constructor.materials.ACCELERATOR;
				break;

			case this.constructor.LIGHTBLUE:
				this.material = this.constructor.materials.LIGHTBLUE;
				break;

			case this.constructor.GREEN:
			default:
				this.material = this.constructor.materials.GREEN;
				break;
		}
	}

	raycast(ray)
	{
		let a, b, c,
			intersection;

		let va = new THREE.Vector3(),
			vb = new THREE.Vector3(),
			vc = new THREE.Vector3();

		let indices = this.geometry.index.array,
			positions = this.geometry.attributes.position,
			uvs = this.geometry.attributes.uv.array;

		for (let i = 0, l = indices.length; i < l; i += 3)
		{
			a = indices[i];
			b = indices[i + 1];
			c = indices[i + 2];

			va.fromAttribute(positions, a);

			intersection = checkBufferGeometryIntersection( this, raycaster, ray, positions, uvs, a, b, c );

			if (intersection)
			{
				intersection.faceIndex = Math.floor( i / 3 ); // triangle number in indices buffer semantics
				return intersection;
			}
		}
	}
}

Plate.GREEN = 1;
Plate.ACCELERATOR = 2;
Plate.LIGHTBLUE = 3;
Plate.YELLOW = 4;

Plate.materials = {
	YELLOW: new THREE.MeshBasicMaterial({
		side: THREE.FrontSide,
		name: "plate-state",
		// blending: THREE.AdditiveBlending,
		transparent: true,
		color: 0xFFFF00
	}),
	GREEN: new THREE.MeshBasicMaterial({
		side: THREE.FrontSide,
		name: "plate-common",
		// blending: THREE.AdditiveBlending,
		transparent: true,
		color: 0x00FF00
	}),
	LIGHTBLUE: new THREE.MeshBasicMaterial({
		side: THREE.FrontSide,
		name: "plate-jump",
		// blending: THREE.AdditiveBlending,
		transparent: true,
		color: 0x0088FF
	}),
	ACCELERATOR: new THREE.MeshBasicMaterial({
		side: THREE.FrontSide,
		name: "plate-pusher",
		// blending: THREE.AdditiveBlending,
		transparent: true,
		color: 0xCCCC00
	// }),
	// FINISH: new THREE.ShaderMaterial({
	// 	uniforms: {
	// 		time: { type: "f", value: 0 },
	// 		resolution: { type: "v2", value: new THREE.Vector2 }
	// 	}
	})
};

export default Plate