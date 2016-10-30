import Plate from '../../src/dive/Plate.js';
import Ring from '../../src/dive/Ring.js';
import Tube from '../../src/dive/Tube.js';

import Protagonist from '../../src/dive/Protagonist.js';

import PromiseLoader from '../../src/PromiseLoader.js';

var renderer, scene, camera;
var background, tube;
var player,
	command = {
		keyboard: {}
	};

function init(width, height) {
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		// preserveDrawingBuffer: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0x000000, 1);
	renderer.setSize(width, height);

	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(60, width / height, 1, 300);
	camera.lookAt(new THREE.Vector3(0, 0, 100));
	camera.position.y = -12;

	scene = new THREE.Scene();

	var light = new THREE.PointLight(0xffffff, 1.5, 130);
	scene.add(light);

	window.scene = scene;
	window.renderer = renderer;
	window.camera = camera;
}

function setup() {
	let radius = 20,
		depth = 300,
		segments = 12;

	tube = new Tube(radius, depth, segments);
	scene.add(tube);

	background = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(1280, 720),
		new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0xAAAAAA })
		);
	background.position.set(0, -10, 270);
	scene.add(background);

	player = new Protagonist(1, 4, 6);
	player.position.set(0, -20, 16);
	scene.add(player);

	Promise.all([
		PromiseLoader.texture('plate_common.png'),
		PromiseLoader.texture('plate_pusher.png'),
		PromiseLoader.texture('3.jpg'),
		// PromiseLoader.plaintext('shader_vertex.txt'),
		// PromiseLoader.plaintext('shader_fragment.txt')
	]).then(function (textures) {
		Plate.materials.GREEN.map = textures[0];
		Plate.materials.LIGHTBLUE.map = textures[0];
		Plate.materials.YELLOW.map = textures[0];
		Plate.materials.ACCELERATOR.map = textures[1];
		background.material.map = textures[2];

		// Plate.materials.FINISH.vertexShader = textures[3];
		// Plate.materials.FINISH.fragmentShader = textures[4];

		let i = textures.length;
		while (i--)
			if (textures[i] instanceof THREE.Texture)
				textures[i].needsUpdate = true;

		renderer.frame = requestAnimationFrame(render);
		setTimeout(function () {
			tube.speed.z = 0.5;
		}, 3000);
	});
}

function render(t) {
	var ring, plate,
		p, r = tube.children.length;

	player.jumpTimer = player.jumpTimer || 0;
	player.newRY = player.rotation.y;
	player.newPX = player.position.x;

	player.air = (player.jumpTimer > 0)

	if (tube.speed.z != 0) {

		// Minimum speed
		if (tube.speed.z < 0.1)
			tube.speed.z = 0.1;

		// Downside acceleration
		if (tube.speed.z < 2)
			tube.speed.z *= 1.014;

		// Friction
		if (tube.speed.z > 2)
			tube.speed.z *= 0.95;

		// Jump
		if (player.jumpTimer > 0.9) {
			player.mesh.rotation.x = -0.15 * (1 + Math.sin(2 * Math.PI * (player.jumpTimer - 0.25)));
			player.mesh.position.y = 6 * (2 - player.jumpTimer);
			player.elevate -= tube.speed.z;
			player.jumpTimer = 1 + player.elevate / 25;
		} else if (player.jumpTimer > 0) {
			player.mesh.position.y = 6 * (1 - Math.pow(player.jumpTimer - 1, 2));
			player.jumpTimer -= 0.03;
		}

		if (Math.abs(player.newRY) < 0.001)
			player.newRY = 0;

		if (Math.abs(player.newPX) < 0.001)
			player.newPX = 0;

		// Return player to the center
		player.newRY *= 0.8;
		player.newPX *= 0.95;

		while (r--) {
			ring = tube.children[r];
			ring.position.z -= tube.speed.z;

			if (ring.position.z < -ring.parameters.depth) {
				ring.position.z += ring.parameters.depth * tube.children.length;

				p = ring.children.length;
				while (p--) {
					plate = ring.children[p];

					plate.visible = Math.random() > 0.2;
					plate.rotation.x = 0;
					plate.changeType(Plate.GREEN);

					if (Math.random() < 0.05) {
						plate.visible = true;
						plate.changeType(Plate.ACCELERATOR);
					}

					if (!plate.visible && Math.random() < 0.2) {
						if (r + 1 == tube.children.length)
							plate = tube.children[0].children[p];
						else
							plate = tube.children[r + 1].children[p];

						plate.rotation.x = 0.2;
						plate.changeType(Plate.LIGHTBLUE);
					}
				}
			}
		}

		tube.speed.x *= 0.75;
		if (Math.abs(tube.speed.x) < 0.0001)
			tube.speed.x = 0;

		if (command.keyboard[32] && player.jumpTimer < 0.1) { // SPACE
			player.elevate = 25;
			player.jumpTimer = 2;
		}

		if (command.keyboard[65]) { // A
			tube.speed.x -= 0.005;

			player.newRY += 0.04;
			player.newPX += (Math.abs(player.newPX) + 0.05) * 0.08;
		}

		if (command.keyboard[68]) { // D
			tube.speed.x += 0.005;

			player.newRY -= 0.04;
			player.newPX -= (Math.abs(player.newPX) + 0.05) * 0.08;
		}

		if (command.keyboard[83]) // S
			tube.speed.z *= 0.95;

		if (command.keyboard[87]) // W
			tube.speed.z = 5;

		tube.speed.x = Math.min(0.05, Math.max(-0.05, tube.speed.x));
		tube.rotation.z += tube.speed.x;
		background.rotation.z += tube.speed.x * 0.5;

		player.position.x = Math.min(3, Math.max(-3, player.newPX));
		player.rotation.y = Math.min(0.2, Math.max(-0.2, player.newRY));

		player.mesh.position.y = Math.max(0, player.mesh.position.y);

		document.querySelector('.label.player-p').textContent = tube.speed.z;
		document.querySelector('.label.player-x-calc').textContent = player.newPX;
		document.querySelector('.label.player-x').textContent = player.position.x;
	}

	renderer.render(scene, camera);

	renderer.frame = requestAnimationFrame(render);
}

window.addEventListener('keydown', function (e) {
	command.keyboard[e.keyCode] = true;
}, true);
window.addEventListener('keyup', function (e) {
	command.keyboard[e.keyCode] = false;
}, true);
window.addEventListener('blur', function (e) {
	cancelAnimationFrame(renderer.frame);
	console.log(command.keyboard);
}, true);
window.addEventListener('focus', function (e) {
	cancelAnimationFrame(renderer.frame);
	renderer.frame = requestAnimationFrame(render);
}, true);

init(innerWidth, innerHeight);
setup();