class CharacterCard extends THREE.Object3D
{
	constructor(character)
	{
		super();

		this.counter = -1;

		this.front = new THREE.Mesh(
			CharacterCard.geometry,
			new THREE.MeshBasicMaterial({
					map: character.texture,
					transparent: true,
					color: 0xFFFFFF,
					side: THREE.FrontSide
				})
			);
		this.front.position.x = 0.02;

		this.back = new THREE.Mesh(
				CharacterCard.geometry,
				new THREE.MeshBasicMaterial({
					map: character.texture,
					transparent: true,
					color: 0x000000,
					side: THREE.BackSide
				})
			);
		this.back.position.x = -0.02;

		this.add(this.front, this.back);

		character.card = this;
	}
}

CharacterCard.geometry = new THREE.PlaneBufferGeometry(10, 20);

export default CharacterCard