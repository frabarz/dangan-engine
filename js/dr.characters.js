var DR = DR || {};

DR.CHARACTERS = [];

DR.CHARACTERS[ 0] = "naegi";
DR.CHARACTERS[ 1] = "maizono";
DR.CHARACTERS[ 2] = "ishimaru";
DR.CHARACTERS[ 3] = "ikusaba";
DR.CHARACTERS[ 4] = "oogami";
DR.CHARACTERS[ 5] = "kirigiri";
DR.CHARACTERS[ 6] = "oowada";
DR.CHARACTERS[ 7] = "asahina";
DR.CHARACTERS[ 8] = "";
DR.CHARACTERS[ 9] = "hagakure";
DR.CHARACTERS[10] = "fujisaki";
DR.CHARACTERS[11] = "togami";
DR.CHARACTERS[12] = "celes";
DR.CHARACTERS[13] = "kuwata";
DR.CHARACTERS[14] = "fukawa";
DR.CHARACTERS[15] = "yamada";

DR.Sprites = (function () {
	"use strict";

	var textures = {};

	function changeSprite(character, sprite) {
		if (character in textures)
			textures[character].image.src = '/sprites/' + character + '/' + sprite + '.png';
		else
			throw new Error('Personaje no participa del juicio: ' + character);
	}

	function getTexture(character) {
		if (!character)
			return;

		if (!(character in textures))
			textures[character] = THREE.ImageUtils.loadTexture('/sprites/' + character + '/1.png');

		return textures[character];
	}


	return {
		getTexture: getTexture,
		change: changeSprite
	};
})();