(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcDivePlateJs = require('../../src/dive/Plate.js');

var _srcDivePlateJs2 = _interopRequireDefault(_srcDivePlateJs);

var _srcDiveRingJs = require('../../src/dive/Ring.js');

var _srcDiveRingJs2 = _interopRequireDefault(_srcDiveRingJs);

var _srcDiveTubeJs = require('../../src/dive/Tube.js');

var _srcDiveTubeJs2 = _interopRequireDefault(_srcDiveTubeJs);

var _srcDiveProtagonistJs = require('../../src/dive/Protagonist.js');

var _srcDiveProtagonistJs2 = _interopRequireDefault(_srcDiveProtagonistJs);

var _srcPromiseLoaderJs = require('../../src/PromiseLoader.js');

var _srcPromiseLoaderJs2 = _interopRequireDefault(_srcPromiseLoaderJs);

var renderer, scene, camera;
var background, tube;
var player,
    command = {
	keyboard: {}
};

function init(width, height) {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	// preserveDrawingBuffer: true
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
	var radius = 20,
	    depth = 300,
	    segments = 12;

	tube = new _srcDiveTubeJs2['default'](radius, depth, segments);
	scene.add(tube);

	background = new THREE.Mesh(new THREE.PlaneBufferGeometry(1280, 720), new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0xAAAAAA }));
	background.position.set(0, -10, 270);
	scene.add(background);

	player = new _srcDiveProtagonistJs2['default'](1, 4, 6);
	player.position.set(0, -20, 16);
	scene.add(player);

	Promise.all([_srcPromiseLoaderJs2['default'].texture('plate_common.png'), _srcPromiseLoaderJs2['default'].texture('plate_pusher.png'), _srcPromiseLoaderJs2['default'].texture('3.jpg')]).
	// PromiseLoader.plaintext('shader_vertex.txt'),
	// PromiseLoader.plaintext('shader_fragment.txt')
	then(function (textures) {
		_srcDivePlateJs2['default'].materials.GREEN.map = textures[0];
		_srcDivePlateJs2['default'].materials.LIGHTBLUE.map = textures[0];
		_srcDivePlateJs2['default'].materials.YELLOW.map = textures[0];
		_srcDivePlateJs2['default'].materials.ACCELERATOR.map = textures[1];
		background.material.map = textures[2];

		// Plate.materials.FINISH.vertexShader = textures[3];
		// Plate.materials.FINISH.fragmentShader = textures[4];

		var i = textures.length;
		while (i--) if (textures[i] instanceof THREE.Texture) textures[i].needsUpdate = true;

		renderer.frame = requestAnimationFrame(render);
		setTimeout(function () {
			tube.speed.z = 1;
		}, 3000);
	});
}

function render(t) {
	var ring,
	    plate,
	    p,
	    r = tube.children.length;

	player.jumpTimer = player.jumpTimer || 0;
	player.newRY = player.rotation.y;
	player.newPX = player.position.x;

	player.air = player.jumpTimer > 0;

	if (tube.speed.z != 0) {

		// Minimum speed
		if (tube.speed.z < 0.1) tube.speed.z = 0.1;

		// Downside acceleration
		if (tube.speed.z < 2) tube.speed.z *= 1.014;

		// Friction
		if (tube.speed.z > 2) tube.speed.z *= 0.95;

		if (player.jumpTimer > 1) {
			player.mesh.rotation.x = -0.15 * (1 + Math.sin(2 * Math.PI * (player.jumpTimer - 0.25)));
			player.mesh.position.y = 5 * (2 - player.jumpTimer);
			player.jumpTimer -= 0.05;
		} else if (player.jumpTimer > 0) {
			player.mesh.position.y = 5 * (1 - Math.pow(player.jumpTimer - 1, 2));
			player.jumpTimer -= 0.03;
		}

		if (Math.abs(player.newRY) < 0.001) player.newRY = 0;

		if (Math.abs(player.newPX) < 0.001) player.newPX = 0;

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
					plate.changeType(_srcDivePlateJs2['default'].GREEN);

					if (Math.random() < 0.05) {
						plate.visible = true;
						plate.changeType(_srcDivePlateJs2['default'].ACCELERATOR);
					}

					if (!plate.visible && Math.random() < 0.2) {
						if (r + 1 == tube.children.length) plate = tube.children[0].children[p];else plate = tube.children[r + 1].children[p];

						plate.rotation.x = 0.2;
						plate.changeType(_srcDivePlateJs2['default'].LIGHTBLUE);
					}
				}
			}
		}

		tube.speed.x *= 0.75;
		if (Math.abs(tube.speed.x) < 0.0001) tube.speed.x = 0;

		if (command.keyboard[32] && player.jumpTimer < 0.1) {
			// SPACE
			player.jumpTimer = 2;
		}

		if (command.keyboard[65]) {
			// A
			tube.speed.x -= 0.005;

			player.newRY += 0.04;
			player.newPX += (Math.abs(player.newPX) + 0.05) * 0.08;
		}

		if (command.keyboard[68]) {
			// D
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

		document.querySelector('.label.player-p').textContent = player.mesh.rotation.x;
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

},{"../../src/PromiseLoader.js":2,"../../src/dive/Plate.js":3,"../../src/dive/Protagonist.js":5,"../../src/dive/Ring.js":6,"../../src/dive/Tube.js":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FetchResponse = (function () {
	function FetchResponse(src, request) {
		_classCallCheck(this, FetchResponse);

		this.url = src;

		this.status = request.status;
		this.statusText = request.statusText;

		this.response = request.responseText || request.response;
	}

	_createClass(FetchResponse, [{
		key: 'text',
		value: function text() {
			return Promise.resolve(this.response);
		}
	}, {
		key: 'json',
		value: function json() {
			return Promise.resolve(JSON.parse(this.response));
		}
	}]);

	return FetchResponse;
})();

exports['default'] = {
	fetch: window.fetch.bind(window) || function (src, options) {
		options = options || {};

		return new Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();
			req.open(options.method || 'GET', src, true);
			req.onload = function () {
				if (this.status > 199 && this.status < 299) resolve(new FetchResponse(this));else reject(new FetchResponse(this));
			};
			req.send();
		});
	},

	texture: function texture(src) {
		return new Promise(function (resolve) {
			var texture = new THREE.Texture(new Image());

			texture.image.onload = function () {
				texture.image.onload = null;
				resolve(texture);
			};

			texture.image.src = src;
		});
	},

	plaintext: function plaintext(src) {
		return this.fetch(src).then(function (response) {
			return response.text();
		});
	},

	json: function json(src) {
		return this.fetch(src).then(function (response) {
			return response.json();
		});
	}

};
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _PlateBufferGeometryJs = require('./PlateBufferGeometry.js');

var _PlateBufferGeometryJs2 = _interopRequireDefault(_PlateBufferGeometryJs);

var geometry = undefined;

var Plate = (function (_THREE$Mesh) {
	_inherits(Plate, _THREE$Mesh);

	function Plate(width, length) {
		_classCallCheck(this, Plate);

		if (!geometry) geometry = new _PlateBufferGeometryJs2["default"](width, length);

		_get(Object.getPrototypeOf(Plate.prototype), "constructor", this).call(this, geometry, Plate.materials.GREEN);

		this.behavior = this.constructor.GREEN;
	}

	_createClass(Plate, [{
		key: "changeType",
		value: function changeType(type) {
			this.behavior = type || this.constructor.GREEN;

			switch (type) {
				case this.constructor.YELLOW:
					this.material = this.constructor.materials.YELLOW;
					break;

				case this.constructor.ACCELERATOR:
					this.material = this.constructor.materials.ACCELERATOR;
					break;

				case this.constructor.LIGHTBLUE:
					this.material = this.constructor.materials.LIGHTBLUE;
					break;

				case this.constructor.GREEN:
				default:
					this.material = this.constructor.materials.GREEN;
					break;
			}
		}
	}, {
		key: "raycast",
		value: function raycast(ray) {
			var a = undefined,
			    b = undefined,
			    c = undefined,
			    intersection = undefined;

			var va = new THREE.Vector3(),
			    vb = new THREE.Vector3(),
			    vc = new THREE.Vector3();

			var indices = this.geometry.index.array,
			    positions = this.geometry.attributes.position,
			    uvs = this.geometry.attributes.uv.array;

			for (var i = 0, l = indices.length; i < l; i += 3) {
				a = indices[i];
				b = indices[i + 1];
				c = indices[i + 2];

				va.fromAttribute(positions, a);

				intersection = checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c);

				if (intersection) {
					intersection.faceIndex = Math.floor(i / 3); // triangle number in indices buffer semantics
					return intersection;
				}
			}
		}
	}]);

	return Plate;
})(THREE.Mesh);

Plate.GREEN = 1;
Plate.ACCELERATOR = 2;
Plate.LIGHTBLUE = 3;
Plate.YELLOW = 4;

Plate.materials = {
	YELLOW: new THREE.MeshBasicMaterial({
		side: THREE.FrontSide,
		name: "plate-state",
		// blending: THREE.AdditiveBlending,
		transparent: true,
		color: 0xFFFF00
	}),
	GREEN: new THREE.MeshBasicMaterial({
		side: THREE.FrontSide,
		name: "plate-common",
		// blending: THREE.AdditiveBlending,
		transparent: true,
		color: 0x00FF00
	}),
	LIGHTBLUE: new THREE.MeshBasicMaterial({
		side: THREE.FrontSide,
		name: "plate-jump",
		// blending: THREE.AdditiveBlending,
		transparent: true,
		color: 0x0088FF
	}),
	ACCELERATOR: new THREE.MeshBasicMaterial({
		side: THREE.FrontSide,
		name: "plate-pusher",
		// blending: THREE.AdditiveBlending,
		transparent: true,
		color: 0xCCCC00
		// }),
		// FINISH: new THREE.ShaderMaterial({
		// 	uniforms: {
		// 		time: { type: "f", value: 0 },
		// 		resolution: { type: "v2", value: new THREE.Vector2 }
		// 	}
	})
};

exports["default"] = Plate;
module.exports = exports["default"];

},{"./PlateBufferGeometry.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
		value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlateBufferGeometry = (function (_THREE$BufferGeometry) {
		_inherits(PlateBufferGeometry, _THREE$BufferGeometry);

		function PlateBufferGeometry(width, depth) {
				_classCallCheck(this, PlateBufferGeometry);

				_get(Object.getPrototypeOf(PlateBufferGeometry.prototype), 'constructor', this).call(this);

				this.type = 'PlateBufferGeometry';

				this.parameters = {
						width: width,
						depth: depth
				};

				var i = undefined,
				    vertices = new Float32Array(4 * 3),
				    normals = new Float32Array(4 * 3),
				    uvs = new Float32Array(4 * 2),
				    indices = new Uint16Array(2 * 3);

				uvs[0] = 0;
				uvs[1] = 1;
				vertices[0] = -width / 2;
				vertices[1] = 0;
				vertices[2] = depth;

				uvs[2] = 1;
				uvs[3] = 1;
				vertices[3] = width / 2;
				vertices[4] = 0;
				vertices[5] = depth;

				uvs[4] = 0;
				uvs[5] = 0;
				vertices[6] = -width / 2;
				vertices[7] = 0;
				vertices[8] = 0;

				uvs[6] = 1;
				uvs[7] = 0;
				vertices[9] = width / 2;
				vertices[10] = 0;
				vertices[11] = 0;

				for (i = 0; i < 8; i += 4) {
						normals[i + 0] = Math.cos(Math.PI / 2.4);
						normals[i + 1] = Math.sin(Math.PI / 2.4);

						normals[i + 2] = -Math.cos(Math.PI / 2.4);
						normals[i + 3] = Math.sin(Math.PI / 2.4);
				}

				indices[0] = 0;
				indices[1] = 2;
				indices[2] = 1;
				indices[3] = 2;
				indices[4] = 3;
				indices[5] = 1;

				this.setIndex(new THREE.BufferAttribute(indices, 1));

				this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
				this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
				this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
		}

		return PlateBufferGeometry;
})(THREE.BufferGeometry);

exports['default'] = PlateBufferGeometry;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Protagonist = (function (_THREE$Object3D) {
	_inherits(Protagonist, _THREE$Object3D);

	function Protagonist(width, height, depth) {
		_classCallCheck(this, Protagonist);

		_get(Object.getPrototypeOf(Protagonist.prototype), "constructor", this).call(this);

		this.ray = new THREE.Ray();
		this.ray.direction.set(0, -1, 0);

		this.air = false;
		this.speed = new THREE.Vector3(0, 0, 0);

		this.mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshLambertMaterial());
		this.add(this.mesh);

		var v = this.mesh.geometry.vertices.length;
		while (v--) this.mesh.geometry.vertices[v].y += 2;
	}

	_createClass(Protagonist, [{
		key: "updateOrigin",
		value: function updateOrigin() {
			this.ray.origin.copy(this.position);
		}
	}, {
		key: "coordinates",
		get: function get() {
			return {
				position: this.mesh.position.clone(),
				rotation: this.mesh.rotation.clone()
			};
		},
		set: function set(coordinates) {
			this.mesh.position.copy(coordinates.position);
			this.mesh.rotation.copy(coordinates.rotation);
		}
	}]);

	return Protagonist;
})(THREE.Object3D);

exports["default"] = Protagonist;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _PlateJs = require('./Plate.js');

var _PlateJs2 = _interopRequireDefault(_PlateJs);

var Ring = (function (_THREE$Object3D) {
	_inherits(Ring, _THREE$Object3D);

	function Ring(radius, depth) {
		_classCallCheck(this, Ring);

		_get(Object.getPrototypeOf(Ring.prototype), "constructor", this).call(this);

		this.parameters = {
			radius: radius,
			depth: depth
		};

		var width = 2 * radius * Math.tan(15 / 360 * 2 * Math.PI);

		for (var i = 0; i < 12; i++) {
			var plate = new _PlateJs2["default"](width, depth);

			plate.rotation.z = (3 + i) / 12 * 2 * Math.PI;
			plate.rotation.order = "ZXY";

			plate.position.x = -radius * Math.cos(i / 12 * 2 * Math.PI);
			plate.position.y = -radius * Math.sin(i / 12 * 2 * Math.PI);

			this.add(plate);
		}
	}

	_createClass(Ring, [{
		key: "raycastPlates",
		value: function raycastPlates(ray) {
			var plate = undefined,
			    r = this.children.length;

			while (r--) {
				plate = this.children[r].raycast(ray);

				if (plate) return plate;
			}
		}
	}]);

	return Ring;
})(THREE.Object3D);

exports["default"] = Ring;
module.exports = exports["default"];

},{"./Plate.js":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _RingJs = require('./Ring.js');

var _RingJs2 = _interopRequireDefault(_RingJs);

var Tube = (function (_THREE$Object3D) {
	_inherits(Tube, _THREE$Object3D);

	function Tube(radius, length, segments) {
		_classCallCheck(this, Tube);

		_get(Object.getPrototypeOf(Tube.prototype), 'constructor', this).call(this);

		var depth = length / segments;

		this.speed = new THREE.Vector3();

		this.parameters = {
			radius: radius,
			depth: depth,
			segments: segments
		};

		while (segments--) {
			var ring = new _RingJs2['default'](radius, depth);
			ring.position.z = segments * depth;
			this.add(ring);
		}
	}

	_createClass(Tube, [{
		key: 'raycastPlates',
		value: function raycastPlates(ray) {
			var plate = undefined,
			    r = this.children.length;

			while (r--) {
				plate = this.children[r].raycastPlates(ray);

				if (plate) return plate;
			}
		}
	}]);

	return Tube;
})(THREE.Object3D);

exports['default'] = Tube;
module.exports = exports['default'];

},{"./Ring.js":6}]},{},[1])


//# sourceMappingURL=bundle.js.map
