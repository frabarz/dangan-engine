export default class PlateBufferGeometry extends THREE.BufferGeometry
{
	constructor(width, depth)
	{
		super();

		this.type = 'PlateBufferGeometry';

		this.parameters = {
			width: width,
			depth: depth
		};

		let i,
			vertices = new Float32Array(4 * 3),
			normals = new Float32Array(4 * 3),
			uvs = new Float32Array(4 * 2),
			indices = new Uint16Array(2 * 3);

		uvs[0] = 0;
		uvs[1] = 1;
		vertices[ 0] = -width / 2;
		vertices[ 1] = 0;
		vertices[ 2] = depth;

		uvs[2] = 1;
		uvs[3] = 1;
		vertices[ 3] = width / 2;
		vertices[ 4] = 0;
		vertices[ 5] = depth;

		uvs[4] = 0;
		uvs[5] = 0;
		vertices[ 6] = -width / 2;
		vertices[ 7] = 0;
		vertices[ 8] = 0;

		uvs[6] = 1;
		uvs[7] = 0;
		vertices[ 9] = width / 2;
		vertices[10] = 0;
		vertices[11] = 0;

		for (i = 0; i < 8; i += 4) {
			normals[i+0] = Math.cos(Math.PI / 2.4);
			normals[i+1] = Math.sin(Math.PI / 2.4);

			normals[i+2] = -Math.cos(Math.PI / 2.4);
			normals[i+3] = Math.sin(Math.PI / 2.4);
		}

		indices[0] = 0
		indices[1] = 2
		indices[2] = 1
		indices[3] = 2
		indices[4] = 3
		indices[5] = 1

		this.setIndex( new THREE.BufferAttribute(indices, 1) );

		this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
		this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
		this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
	}
}