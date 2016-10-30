export default class Protagonist extends THREE.Object3D
{
	constructor(width, height, depth)
	{
		super();

		this.ray = new THREE.Ray();
		this.ray.direction.set(0, -1, 0);

		this.air = false;
		this.speed = new THREE.Vector3(0, 0, 0);

		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(width, height, depth),
			new THREE.MeshLambertMaterial()
			);
		this.add(this.mesh);

		let v = this.mesh.geometry.vertices.length;
		while (v--)
			this.mesh.geometry.vertices[v].y += 2;
	}

	updateOrigin()
	{
		this.ray.origin.copy(this.position);
	}

	get coordinates()
	{
		return {
			position: this.mesh.position.clone(),
			rotation: this.mesh.rotation.clone()
		};
	}

	set coordinates(coordinates)
	{
		this.mesh.position.copy(coordinates.position);
		this.mesh.rotation.copy(coordinates.rotation);
	}
}