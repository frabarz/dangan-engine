import DiscussionAnimation from './animation/DiscussionAnimation.js';
import NSDAnimation from './animation/NSDAnimation.js';

import Character from './Character.js';

import HUD from './HUD.js';

export default class Trial
{
    constructor(width, height)
    {
        this.WIDTH = width;
        this.HEIGHT = height;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            // preserveDrawingBuffer: true
        });
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.setSize(width, height);

        this.scene = new THREE.Scene();

        this.cameras = [];
        this.characters = {};

        var light = new THREE.PointLight(0xffffff, 1.5, 130);
        light.position.set(0, 0, 30);
        this.scene.add(light);

        this.createCamera();
    
		this.animation = new DiscussionAnimation(this);
    }

    createCamera(params)
    {
        var camera = new THREE.PerspectiveCamera(40, this.WIDTH / this.HEIGHT, 1, 300);
        camera.position.set(10, 10, 10);
        camera.lookAt(new THREE.Vector3(0, 0, 10));

        this.cameras.push(camera);
        this.scene.add(camera);
        this.mainCamera = camera;
    }

    setCharacter(character, position)
    {
        if (!character)
            return;

		character = new Character(character);
		this.characters[character.id] = character;

		this.scene.add(character.card);
		character.card.locateInStands(position);
    }
    
    changeStage(mode)
	{
		switch (mode)
    {
			case 'discussion':
				this.animation = new DiscussionAnimation(this);
				break;
        
            case 'nsd':
				this.animation = new NSDAnimation(this);
                break;
        }
        
		return this.hud.setScreen(mode);
    }

    appendCanvasTo(holder)
    {
        (typeof holder === 'string' ? document.querySelector(holder) : holder).appendChild(this.renderer.domElement);
        return this;
    }

    setupHUD(holder, id)
    {
        this.hud = new HUD(this.WIDTH, this.HEIGHT);
        this.hud.canvas.id = id || 'hud';
        document.querySelector(holder).appendChild(this.hud.canvas);
        return this;
    }

	render(time)
    {
        this.renderer.render(this.scene, this.mainCamera);
		this.hud.draw(time);
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