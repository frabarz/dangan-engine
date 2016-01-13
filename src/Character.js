class Character
{
    constructor(character, i)
    {
        this.id = character.id;
        this.name = character.name;
        this.position = i;
        
        this.texture = new THREE.Texture(new Image);
        this.texture.image.onload = ImageLoadHandler.bind(this.texture);

        this.changeSprite(1);

        this.card = new CharacterCard(this);
    }
    
    get textureUri()
    {
        return Character.TEXTURE_SRC_URI + this.id + '/' + this.sprite + '.png'
    }
    
    changeSprite(sprite)
    {
        this.sprite = sprite;
        this.texture.image.src = this.textureUri;
    }
}

Character.TEXTURE_SRC_URI = '/resources/sprites/';

function ImageLoadHandler() {
    this.needsUpdate = true;
}

class CharacterCard extends THREE.Object3D
{
    constructor(character)
    {
        super();
        
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
}

CharacterCard.geometry = new THREE.PlaneBufferGeometry(10, 20);

Object.defineProperty(Character, 'Card', {
    value: CharacterCard,
    writable: false
});

export default Character