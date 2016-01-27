class Character
{
	constructor(character)
	{
		this.id = character.id;
		this.name = character.name;

		this.texture = new THREE.Texture(new Image);
		this.texture.image.onload = ImageLoadHandler.bind(this.texture);

		(character.id != Character.NARRATOR) && this.changeSprite('sprite' in character ? character.sprite : 1);
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
	var i, img_data,
		img_w = Math.floor(this.image.naturalWidth / 3),
		img_h = this.image.naturalHeight,
		ctx = document.createElement('canvas').getContext('2d');

	ctx.canvas.width = img_w;
	ctx.canvas.height = img_h;

	ctx.drawImage(this.image,
		img_w, 0, img_w, img_h,
		img_w, 0, img_w, img_h);

	img_data = ctx.getImageData(img_w, 0, img_w, img_h);

	for(i = 0; i < img_data.data.length; i += 4)
	{
		if (img_data.data[i] != 0)
		{
			this.headLevel = (img_h - Math.floor(i / img_w)) * 6 / 7;
			break;
		}
	}

	img_data = null;
	ctx = null;

	this.needsUpdate = true;
}

export default Character