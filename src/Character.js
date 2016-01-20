class Character
{
	constructor(character)
	{
		this.id = character.id;
		this.name = character.name;

		this.texture = new THREE.Texture(new Image);
		this.texture.image.onload = ImageLoadHandler.bind(this.texture);

		this.changeSprite(1);

		this.card = new CharacterCard(this);
	}

	get fullbodySpriteUri()
	{
		return Character.RESOURCES_PATH + Character.FULLBODY_PATH + this.id + '/' + this.sprite + '.png'
	}

	get bustSpriteUri()
	{
		return Character.RESOURCES_PATH + Character.BUST_PATH + this.id + '.png';
	}

	changeSprite(sprite)
	{
		this.sprite = sprite;
		this.texture.image.src = this.fullbodySpriteUri;
	}
}

Character.RESOURCES_PATH = '/resources/';
Character.FULLBODY_PATH = 'sprites/';
Character.BUST_PATH = 'busts/';

Character.NARRATOR = 'narrator';

function ImageLoadHandler() {
	this.needsUpdate = true;
}

class CharacterCard extends THREE.Object3D
{
	constructor(character)
	{
		super();

		this.card_front = new THREE.Mesh(
			CharacterCard.geometry,
			new THREE.MeshBasicMaterial({
					map: character.texture,
					transparent: true,
					color: 0xFFFFFF,
					side: THREE.FrontSide
				})
			);
		this.card_front.position.x = 0.02;

		this.card_back = new THREE.Mesh(
				CharacterCard.geometry,
				new THREE.MeshBasicMaterial({
					map: character.texture,
					transparent: true,
					color: 0x000000,
					side: THREE.BackSide
				})
			);
		this.card_back.position.x = -0.02;

		this.add(this.card_front, this.card_back);
	}

	locateInStands(position)
	{
		this.counter = Math.abs(position % 16);

		var ang = (this.counter / 16) * (2 * Math.PI);

		this.rotation.x = Math.PI / 2;
		this.rotation.y = ang - Math.PI / 2;

		this.position.set(22 * Math.cos(ang), 22 * Math.sin(ang), 11);

		ang = null;
	}
}

CharacterCard.geometry = new THREE.PlaneBufferGeometry(10, 20);

Object.defineProperty(Character, 'Card', {
	value: CharacterCard,
	writable: false
});

export default Character