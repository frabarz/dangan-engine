import CharacterCard from './CharacterCard.js';

// I'm really tempted to extend WebGLRenderer for this,
// but it might break something.
export default class SceneRenderer
{
	constructor(width, height)
	{
		this.W = width;
		this.H = height;

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			// preserveDrawingBuffer: true
		});
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.setSize(width, height);

		this.scene = new THREE.Scene();

		var light = new THREE.PointLight(0xffffff, 1.5, 130);
		light.position.set(0, 0, 30);
		this.scene.add(light);

		this.cameras = [];
		this.mainCamera = null;

		this.processor = null;

		this.addElement = this.scene.add.bind(this.scene);
	}

	get canvas()
	{
		return this.renderer.domElement;
	}

	render(time)
	{
		this.processor && this.processor(time);
		this.renderer.render(this.scene, this.mainCamera);
	}

	createCamera(params)
	{
		let camera = new THREE.PerspectiveCamera(45, this.W / this.H, 1, 300);

		camera.position.set(10, 10, 10);
		camera.up.set(0, 0, 1);
		camera.lookAt(new THREE.Vector3(0, 0, 10));

		this.scene.add(camera);

		this.cameras.push(camera);
		this.mainCamera = camera;
	}

	locateCharacter(character, position)
	{
		let card = new CharacterCard(character);

		card.counter = Math.abs(position % 16);

		let ang = (card.counter / 16) * (2 * Math.PI);

		card.rotation.x = Math.PI / 2;
		card.rotation.y = ang - Math.PI / 2;

		card.position.set(
			(23 - 0.5 * Math.pow(-1, position)) * Math.cos(ang),
			(23 - 0.5 * Math.pow(-1, position)) * Math.sin(ang),
			11);

		this.scene.add(card);

		ang = null;
	}

	heIsHere(thebear)
	{
		let card = new CharacterCard(thebear);

		card.front.geometry = (card.back.geometry = new THREE.PlaneBufferGeometry(10, 10));

		card.rotation.x = Math.PI / 2;
		card.rotation.y = Math.PI / 2;

		card.position.set(-50, 0, 19);

		var cube = new THREE.Mesh(
			new THREE.BoxGeometry( 14, 10, 10 ),
			new THREE.MeshLambertMaterial( {color: 0xffcc00} )
			);

		cube.position.set(-50, 0, 7);

		cube.rotation.y = Math.PI / 2;

		this.scene.add( card );
		this.scene.add( cube );
	}

	// I still don't know how, but this will be useful for the Cross Sword Showdown
	renderHalf()
	{
		this.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
		this.renderer.clear();

		// Left side
		this.renderer.setViewport(1, 1, 0.5 * this.WIDTH - 2, this.HEIGHT - 2);
		this.renderer.render(this.scene, this.mainCamera);

		// Right side
		this.renderer.setViewport(0.5 * this.WIDTH + 1, 1, 0.5 * this.WIDTH - 2, this.HEIGHT - 2);
		this.renderer.render(this.scene, this.rightCamera);
	}
}