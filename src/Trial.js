import Animacion from './Animacion.js';

import Character from './Character.js';

import HUD from './HUD.js';
import HUDDiscussionInterface from './HUDDiscussionInterface.js';
import HUDNSDInterface from './HUDNSDInterface.js';

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
    }
    
    set courtroom(obj)
    {
        this.scene.add(obj);
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

        character = new Character(character, position);
        this.scene.add(character.card);

        return;
    }
    
    changeStage(mode)
    {
        var screen;
        
        this.hud.getChildrenByType('interface').forEach(this.hud.remove, this.hud);
        
        switch(mode) {
            case 'nsd':
                screen = new HUDNSDInterface(this.hud.ctx);
                break;
                
            case 'discussion':
            default:
                screen = new HUDDiscussionInterface(this.hud.ctx);
                break;
        }
        
        this.hud.add(screen);
        
        return screen;
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

    render()
    {
        this.renderer.render(this.scene, this.mainCamera);
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