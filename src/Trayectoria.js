export default class Trayectoria
{
	constructor()
	{
		this.geometry = new THREE.SphereGeometry(0.5, 3, 2);
		// this.material = new THREE.MeshBasicMaterial({ color: Math.floor(Math.random() * 0xFFFFFF) });
	}

	getVector(t)
	{
		return {
			x: this.getX(t),
			y: this.getY(t),
			z: this.getZ(t)
		};
	}

	getVector3(t)
	{
		return new THREE.Vector3(this.getX(t), this.getY(t), this.getZ(t));
	}

	// drawStep(scene, t)
	// {
	// 	let esfera = new THREE.Mesh(this.geometry, this.material);
	// 	esfera.position.copy(this.getVector(t));
	// 	scene.add(esfera);
	// 	return esfera;
	// }

	drawPath(scene)
	{
		let obj,
			material = new THREE.LineBasicMaterial({ color: Math.floor(Math.random() * 0xFFFFFF) }),
			geometry = new THREE.Geometry();

		for (let i = 0; i <= 1; i += 0.1)
			geometry.vertices.push( this.getVector3(i) );

		obj = new THREE.Line( geometry, material );
		scene.add(obj);
		return obj;
	}
}
