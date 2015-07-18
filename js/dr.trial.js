(function (DR) {
	"use strict";

	function Trial(width, height) {
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

	Trial.prototype.createCamera = function (params) {
		var camera = new THREE.PerspectiveCamera(40, this.WIDTH / this.HEIGHT, 1, 300);
		camera.position.set(10, 10, 10);
		camera.lookAt(new THREE.Vector3(0, 0, 10));

		this.cameras.push(camera);
		this.scene.add(camera);
		this.mainCamera = camera;
	};

	Trial.prototype.setCharacter = function (character, position) {
		if (!character)
			return this;

		character = new DR.Character(character, position);
		this.scene.add(character.card);

		return this;
	};

	Trial.prototype.appendCanvasTo = function (holder) {
		(holder instanceof HTMLElement ? holder : document.querySelector(holder)).appendChild(this.renderer.domElement);
		return this;
	};

	Trial.prototype.setupHUD = function (holder, id) {
		this.hud = new DR.HUD(this.WIDTH, this.HEIGHT);
		this.hud.canvas.id = id || 'hud';
		document.querySelector(holder).appendChild(this.hud.canvas);
		return this;
	};

	Trial.prototype.render = function () {
		this.renderer.render(this.scene, this.mainCamera);
	};

	// I still don't know how, but this will be useful for the Cross Sword Showdown
	Trial.prototype.renderHalf = function () {
		this.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
		this.renderer.clear();

		// Left side
		this.renderer.setViewport(1, 1, 0.5 * this.WIDTH - 2, this.HEIGHT - 2);
		this.renderer.render(this.scene, this.mainCamera);

		// Right side
		this.renderer.setViewport(0.5 * this.WIDTH + 1, 1, 0.5 * this.WIDTH - 2, this.HEIGHT - 2);
		this.renderer.render(this.scene, this.rightCamera);
	};

	Object.defineProperty(DR, "Trial", {
		value: Trial,
		writable: false
	});
})(window.DR || (window.DR = {}));