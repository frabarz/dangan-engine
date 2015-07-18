(function (DR) {
	"use strict";

	function Character(character, i) {
		this.id = character.id;
		this.name = character.name;
		this.position = i;

		this.sprite = 1;
		this.texture = THREE.ImageUtils.loadTexture('/sprites/' + character.id + '/1.png');

		this.card = new CharacterCard(this);
	}

	Character.prototype.changeSprite = function (sprite) {
		this.texture.image.src = '/sprites/' + this.id + '/' + sprite + '.png';
	};

	function CharacterCard(character) {
		THREE.Object3D.call(this);

		var ang = (character.position / 16) * (2 * Math.PI),
			sin = Math.sin(ang),
			cos = Math.cos(ang),
			front = new THREE.Mesh(
				CharacterCard.geometry,
				new THREE.MeshBasicMaterial({
					color: 0xFFFFFF,
					map: character.texture,
					transparent: true,
					side: THREE.FrontSide
				})
				),
			back = new THREE.Mesh(
				CharacterCard.geometry,
				new THREE.MeshBasicMaterial({
					color: 0x000000,
					map: character.texture,
					transparent: true,
					side: THREE.BackSide
				})
				);

		front.position.x = 0.02;
		back.position.x = -0.02;

		this.rotation.x = Math.PI / 2;
		this.rotation.y = -ang;
		this.position.set(22 * sin, 22 * cos, 11);

		this.add(front, back);

		ang = null;
		sin = cos = null;
		front = back = null;
	}

	CharacterCard.geometry = new THREE.PlaneBufferGeometry(10, 20);
	CharacterCard.prototype = Object.create(THREE.Object3D.prototype);

	Object.defineProperty(Character, 'Card', {
		value: CharacterCard,
		writable: false
	});

	Object.defineProperty(DR, 'Character', {
		value: Character,
		writable: false
	});

})(window.DR || (window.DR = {}));