(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global THREE */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcTrialJs = require('../../src/Trial.js');

var _srcTrialJs2 = _interopRequireDefault(_srcTrialJs);

var _srcCourtroomJs = require('../../src/Courtroom.js');

var _srcCourtroomJs2 = _interopRequireDefault(_srcCourtroomJs);

var _srcAnimationJs = require('../../src/Animation.js');

var _srcAnimationJs2 = _interopRequireDefault(_srcAnimationJs);

var _srcCoordenadaJs = require('../../src/Coordenada.js');

var _srcCoordenadaJs2 = _interopRequireDefault(_srcCoordenadaJs);

var _srcSceneRendererJs = require('../../src/SceneRenderer.js');

var _srcSceneRendererJs2 = _interopRequireDefault(_srcSceneRendererJs);

var _srcHudRendererJs = require('../../src/HudRenderer.js');

var _srcHudRendererJs2 = _interopRequireDefault(_srcHudRendererJs);

document.addEventListener('DOMContentLoaded', function () {
	var width = window.innerWidth,
	    height = Math.floor(9 / 16 * width);

	if (height > window.innerHeight) {
		height = window.innerHeight;
		width = Math.floor(16 / 9 * height);
	}

	var juicio = new _srcTrialJs2['default'](width, height);

	var scene = new _srcSceneRendererJs2['default'](width, height);
	scene.createCamera();
	scene.addElement(new _srcCourtroomJs2['default']());
	juicio.setupRenderer('scene', scene);
	document.querySelector('body').appendChild(scene.canvas);

	var hud = new _srcHudRendererJs2['default'](width, height);
	juicio.setupRenderer('hud', hud);
	document.querySelector('body').appendChild(hud.canvas);

	[{ id: "makoto", name: "Makoto Naegi" }, { id: "hifumi", name: "Hifumi Yamada" }, { id: "touko", name: "Touko Fukawa" }, { id: "leon", name: "Leon Kuwata" }, { id: "celes", name: "Celestia Ludenberg" }, { id: "byakuya", name: "Byakuya Togami" }, { id: "chihiro", name: "Chihiro Fujisaki" }, { id: "yasuhiro", name: "Yasuhiro Hagakure" }, null, { id: "aoi", name: "Aoi Asahina" }, { id: "mondo", name: "Mondo Oowada" }, { id: "kyouko", name: "Kyouko Kirigiri" }, { id: "sakura", name: "Sakura Oogami" }, { id: "junko", name: "Junko Enoshima" }, { id: "kiyotaka", name: "Kiyotaka Ishimaru" }, { id: "sayaka", name: "Sayaka Maizono" }].forEach(juicio.setCharacter, juicio);

	juicio.putTheFuckingBear();
	juicio.setNarrator('Narrator');

	juicio.changeStage('discussion');

	juicio.stage.screen.setDialogue(juicio.characters.makoto, 'This is a very early preview test for the dangan-engine project. Press the button in the corner to start.', true);

	juicio.stage.justKeepRendering();

	document.querySelector('#boton').addEventListener('click', function () {
		juicio.loadScript("demo_001_discussion.json");
	}, false);
}, false);

},{"../../src/Animation.js":2,"../../src/Coordenada.js":5,"../../src/Courtroom.js":6,"../../src/HudRenderer.js":9,"../../src/SceneRenderer.js":11,"../../src/Trial.js":18}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _CoordenadaJs = require('./Coordenada.js');

var _CoordenadaJs2 = _interopRequireDefault(_CoordenadaJs);

var _VideographerJs = require('./Videographer.js');

var _VideographerJs2 = _interopRequireDefault(_VideographerJs);

var Animation = (function () {
	function Animation(renderers) {
		_classCallCheck(this, Animation);

		this.scene = renderers.scene;
		this.hud = renderers.hud;
	}

	_createClass(Animation, [{
		key: 'cutTo',
		value: function cutTo(param) {
			return new Promise((function (end) {
				this.processor = function () {
					if ('fov' in param) {
						this.mainCamera.fov = param.fov;
						this.mainCamera.updateProjectionMatrix();
					}

					if ('position' in param) this.mainCamera.position.copy(_CoordenadaJs2['default'].parse(param.position));

					if ('up' in param) this.mainCamera.up.copy(_CoordenadaJs2['default'].parse(param.up));

					if ('direction' in param) this.mainCamera.lookAt(_CoordenadaJs2['default'].parse(param.direction));

					this.processor = null;
					param = null;
					end();
				};
			}).bind(this.scene));
		}
	}, {
		key: 'transicion',
		value: function transicion(param) {
			if ('preset' in param) return this[param.preset](param);

			return new Promise((function (end) {
				var bp = new _VideographerJs2['default'](param.duration || 6000, param.path, param.easing);

				if ('fov' in param) bp.setupFOV(param.fov.start || this.mainCamera.fov, param.fov.end || param.fov, param.fov);

				if ('position' in param) bp.setupPosition(param.position.start || this.mainCamera.position, param.position.end || param.position, param.position);

				if ('up' in param) bp.setupUp(param.up.start || this.mainCamera.up, param.up.end || param.up, param.up);

				if ('direction' in param) bp.setupDirection(param.direction.start || new THREE.Vector3(0, 0, -10).applyMatrix4(this.mainCamera.matrixWorld), param.direction.end || param.direction, param.direction);

				param = null;

				this.processor = function (now) {
					var avance = bp.delta(now);

					bp.runStage(this.mainCamera, avance);

					if (avance > 1) {
						this.processor = null;
						bp = null;

						end();
					}
				};
			}).bind(this.scene));
		}
	}]);

	return Animation;
})();

exports['default'] = Animation;
module.exports = exports['default'];

},{"./Coordenada.js":5,"./Videographer.js":19}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Character = (function () {
	function Character(character) {
		_classCallCheck(this, Character);

		this.id = character.id;
		this.name = character.name;

		this.texture = new THREE.Texture(new Image());
		this.texture.image.onload = ImageLoadHandler.bind(this.texture);

		character.id != Character.NARRATOR && this.changeSprite('sprite' in character ? character.sprite : 1);
	}

	_createClass(Character, [{
		key: 'changeSprite',
		value: function changeSprite(sprite) {
			this.sprite = sprite;
			this.texture.image.src = this.fullbodySpriteUri;
		}
	}, {
		key: 'fullbodySpriteUri',
		get: function get() {
			return Character.RESOURCES_PATH + Character.FULLBODY_PATH + this.id + '/' + this.sprite + '.png';
		}
	}, {
		key: 'bustSpriteUri',
		get: function get() {
			return Character.RESOURCES_PATH + Character.BUST_PATH + this.id + '.png';
		}
	}]);

	return Character;
})();

Character.RESOURCES_PATH = '/resources/';
Character.FULLBODY_PATH = 'sprites/';
Character.BUST_PATH = 'busts/';

Character.NARRATOR = 'narrator';

function ImageLoadHandler() {
	var i,
	    img_data,
	    img_w = Math.floor(this.image.naturalWidth / 3),
	    img_h = this.image.naturalHeight,
	    ctx = document.createElement('canvas').getContext('2d');

	ctx.canvas.width = img_w;
	ctx.canvas.height = img_h;

	ctx.drawImage(this.image, img_w, 0, img_w, img_h, img_w, 0, img_w, img_h);

	img_data = ctx.getImageData(img_w, 0, img_w, img_h);

	for (i = 0; i < img_data.data.length; i += 4) {
		if (img_data.data[i] != 0) {
			this.headLevel = (img_h - Math.floor(i / img_w)) * 6 / 7;
			break;
		}
	}

	img_data = null;
	ctx = null;

	this.needsUpdate = true;
}

exports['default'] = Character;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CharacterCard = (function (_THREE$Object3D) {
	_inherits(CharacterCard, _THREE$Object3D);

	function CharacterCard(character) {
		_classCallCheck(this, CharacterCard);

		_get(Object.getPrototypeOf(CharacterCard.prototype), "constructor", this).call(this);

		this.counter = -1;

		this.front = new THREE.Mesh(CharacterCard.geometry, new THREE.MeshBasicMaterial({
			map: character.texture,
			transparent: true,
			color: 0xFFFFFF,
			side: THREE.FrontSide
		}));
		this.front.position.x = 0.02;

		this.back = new THREE.Mesh(CharacterCard.geometry, new THREE.MeshBasicMaterial({
			map: character.texture,
			transparent: true,
			color: 0x000000,
			side: THREE.BackSide
		}));
		this.back.position.x = -0.02;

		this.add(this.front, this.back);

		character.card = this;
	}

	return CharacterCard;
})(THREE.Object3D);

CharacterCard.geometry = new THREE.PlaneBufferGeometry(10, 20);

exports["default"] = CharacterCard;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Coordenada = (function () {
	function Coordenada(x, y, z) {
		_classCallCheck(this, Coordenada);

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	_createClass(Coordenada, [{
		key: "toString",
		value: function toString() {
			return "{x:" + this.x + ", y:" + this.y + ", z: " + this.z + "}";
		}
	}, {
		key: "setSpherical",
		value: function setSpherical(r, t, p) {
			// t: inclinación, 0°-180°
			// p: azimuth, 0°-360°

			this.x = r * Math.sin(t) * Math.cos(p);
			this.y = r * Math.sin(t) * Math.sin(p);
			this.z = r * Math.cos(t);
		}
	}, {
		key: "setPolar",
		value: function setPolar(r, p, z) {
			this.x = r * Math.cos(p);
			this.y = r * Math.sin(p);
			this.z = isFinite(z) ? z : this.z;
		}
	}, {
		key: "r",
		get: function get() {
			return Math.sqrt(this.x * this.x + this.y * this.y + (this.spherical ? this.z * this.z : 0));
		},
		set: function set(r) {
			if (this.spherical) this.setSpherical(r, this.t, this.p);else this.setPolar(r, this.p);
		}
	}, {
		key: "t",
		get: function get() {
			return Math.acos(this.z / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
		},
		set: function set(t) {
			this.setSpherical(this.r, t, this.p);
		}
	}, {
		key: "p",
		get: function get() {
			return Math.atan2(this.y, this.x);
		},
		set: function set(p) {
			if (this.spherical) this.setSpherical(this.r, this.t, p);else this.setPolar(this.r, p);
		}
	}, {
		key: "vector3",
		get: function get() {
			return new THREE.Vector3(this.x, this.y, this.z);
		}
	}]);

	return Coordenada;
})();

Coordenada.parse = function (input) {
	if (input instanceof this) return input;else if (input.hasOwnProperty('x')) return new this(input.x, input.y, input.z);else if (input.hasOwnProperty('t')) {
		var point = new this();
		point.spherical = true;
		point.setSpherical(input.r, input.t, input.p);
		return point;
	} else if (input.hasOwnProperty('p')) {
		var point = new this();
		point.setPolar(input.r, input.p, input.z);
		return point;
	} else if (Array.isArray(input)) return new this(input[0], input[1], input[2]);else throw new Error("Coordenada.parse: Couldn't parse input.");
};

exports["default"] = Coordenada;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
        value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _CylinderBufferGeometryJs = require('./CylinderBufferGeometry.js');

var _CylinderBufferGeometryJs2 = _interopRequireDefault(_CylinderBufferGeometryJs);

var _PlatformBufferGeometryJs = require('./PlatformBufferGeometry.js');

var _PlatformBufferGeometryJs2 = _interopRequireDefault(_PlatformBufferGeometryJs);

var _StandGeometryJs = require('./StandGeometry.js');

var _StandGeometryJs2 = _interopRequireDefault(_StandGeometryJs);

var TEXTURES;

function textureLoader(src) {
        var texture = new THREE.Texture(new Image());
        texture.image.onload = ImageLoadHandler.bind(texture);
        texture.image.src = Courtroom.TEXTURE_RELATIVE_URI + src;
        return texture;
}

function ImageLoadHandler() {
        this.needsUpdate = true;
}

var Courtroom = (function (_THREE$Object3D) {
        _inherits(Courtroom, _THREE$Object3D);

        function Courtroom(apothem, height) {
                _classCallCheck(this, Courtroom);

                _get(Object.getPrototypeOf(Courtroom.prototype), 'constructor', this).call(this);

                TEXTURES = {
                        WALLPAPER: textureLoader('chapter1-wallpaper.png'),
                        BASEBOARD: textureLoader('chapter1-guardapolvo.png'),
                        REDCARPET: textureLoader("alfombraR.png"),
                        CURTAIN: textureLoader("chapter1-salida.png"),
                        COLUMN: textureLoader("chapter1-marcos.png"),
                        WOOD: textureLoader("wood.jpg"),
                        CLOUDS: textureLoader("clouds.jpg")
                };

                apothem = apothem || 120;
                height = height || 80;

                this.add(
                // TILED FLOOR
                // side: 240
                // segments: 22
                new Floor(2 * apothem, 22),

                // WALLS
                // amount: 8
                // height: 80
                // apothem: 120
                new Walls(8, height, apothem),

                // EXITS
                // amount: 8
                // apothem: 119
                new Exits(8, apothem - 1)
                // CARPETS
                // width: 8
                // longitude: 100
                .setCarpets(10, 100)
                // CURTAINS
                // width: 36
                .setCurtains(48)
                // PILLARS
                // radius: 5
                // height: 80
                .setPillars(3, height), new Platform(), new TrialStands());
        }

        return Courtroom;
})(THREE.Object3D);

var Floor = (function (_THREE$Mesh) {
        _inherits(Floor, _THREE$Mesh);

        function Floor(ancho, segm) {
                _classCallCheck(this, Floor);

                var material, geometry, i, j, total;

                ancho = ancho || 120;
                segm = segm || 18;

                material = new THREE.MeshFaceMaterial([new THREE.MeshLambertMaterial({
                        color: 0x000000,
                        polygonOffset: true,
                        polygonOffsetFactor: 1.0,
                        polygonOffsetUnits: 4.0
                }), new THREE.MeshLambertMaterial({
                        color: 0xFFFFFF,
                        polygonOffset: true,
                        polygonOffsetFactor: 1.0,
                        polygonOffsetUnits: 4.0
                })]);

                geometry = new THREE.PlaneGeometry(ancho, ancho, segm, segm);

                total = geometry.faces.length / 2;
                for (i = 0; i < total; i++) {
                        j = i * 2;
                        geometry.faces[j].materialIndex = (i + Math.floor(i / segm)) % 2;
                        geometry.faces[j + 1].materialIndex = (i + Math.floor(i / segm)) % 2;
                }

                _get(Object.getPrototypeOf(Floor.prototype), 'constructor', this).call(this, geometry, material);

                this.rotation.z = Math.PI / 8;
                this.position.z = -0.05;

                material = geometry = null;
        }

        return Floor;
})(THREE.Mesh);

var Walls = (function (_THREE$Object3D2) {
        _inherits(Walls, _THREE$Object3D2);

        function Walls(amount, height, apothem) {
                _classCallCheck(this, Walls);

                _get(Object.getPrototypeOf(Walls.prototype), 'constructor', this).call(this);

                var material, geometry;

                material = new THREE.MeshBasicMaterial({
                        color: 0x2D2867,
                        side: THREE.BackSide,
                        map: TEXTURES.WALLPAPER
                });
                geometry = new _CylinderBufferGeometryJs2['default'](amount, height, apothem);
                this.add(new THREE.Mesh(geometry, material));

                TEXTURES.BASEBOARD.wrapT = THREE.RepeatWrapping;
                TEXTURES.BASEBOARD.repeat.set(2, 1);
                material = new THREE.MeshBasicMaterial({
                        color: 0xAAAAAA,
                        side: THREE.BackSide,
                        map: TEXTURES.BASEBOARD
                });
                geometry = new _CylinderBufferGeometryJs2['default'](amount, height * 0.04, apothem - 0.05);

                this.add(new THREE.Mesh(geometry, material));
        }

        return Walls;
})(THREE.Object3D);

var Exits = (function (_THREE$Object3D3) {
        _inherits(Exits, _THREE$Object3D3);

        function Exits(amount, apothem) {
                _classCallCheck(this, Exits);

                _get(Object.getPrototypeOf(Exits.prototype), 'constructor', this).call(this);

                this.amount = amount;
                this.apothem = apothem;
        }

        _createClass(Exits, [{
                key: 'setCurtains',
                value: function setCurtains(width) {
                        var i, angle, geometry, material, mesh;

                        geometry = new THREE.PlaneBufferGeometry(width, width, 1, 1);

                        material = new THREE.MeshBasicMaterial({
                                color: 0xEEEEEE,
                                side: THREE.FrontSide,
                                map: TEXTURES.CURTAIN,
                                transparent: true
                        });

                        for (i = 0.5; i < this.amount; i++) {
                                angle = 2 * Math.PI * i / this.amount;

                                mesh = new THREE.Mesh(geometry, material);

                                mesh.rotation.x = Math.PI / 2;
                                mesh.rotation.y = -angle;

                                mesh.position.x = this.apothem * Math.sin(angle);
                                mesh.position.y = this.apothem * Math.cos(angle);
                                mesh.position.z = width / 2 - 1;

                                this.add(mesh);
                        }

                        material = null;
                        geometry = null;
                        mesh = null;

                        return this;
                }
        }, {
                key: 'setCarpets',
                value: function setCarpets(width, longitude) {
                        var i, angle, geometry, material, mesh;

                        TEXTURES.REDCARPET.wrapT = THREE.RepeatWrapping;
                        TEXTURES.REDCARPET.repeat.set(1, 3);

                        material = new THREE.MeshLambertMaterial({
                                color: 0xFFFFFF,
                                side: THREE.FrontSide,
                                map: TEXTURES.REDCARPET
                        });

                        geometry = new THREE.PlaneBufferGeometry(width, longitude, 1, 1);

                        for (i = 0.5; i < this.amount; i++) {
                                angle = i / this.amount * 2 * Math.PI;

                                mesh = new THREE.Mesh(geometry, material);

                                mesh.rotation.z = angle;

                                mesh.position.x = (this.apothem - longitude / 2) * Math.sin(-angle);
                                mesh.position.y = (this.apothem - longitude / 2) * Math.cos(angle);
                                mesh.position.z = 0.05;

                                this.add(mesh);
                        }

                        material = null;
                        geometry = null;
                        mesh = null;

                        return this;
                }
        }, {
                key: 'setPillars',
                value: function setPillars(radius, height) {
                        var texture, material, geometry, mesh, i, angle, deviation;

                        texture = TEXTURES.COLUMN;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(1, 2);

                        material = new THREE.MeshBasicMaterial({
                                color: 0xFFFFFF,
                                side: THREE.FrontSide,
                                map: texture
                        });

                        geometry = new _CylinderBufferGeometryJs2['default'](4, height, radius);

                        // Custom UV mapping for the game extracted texture
                        angle = [0, 0.17578125, 0.4453125, 0.73046875, 1];
                        for (i = 0; i < 4; i++) {
                                geometry.attributes.uv.array[i * 12 + 0] = angle[i + 1];
                                geometry.attributes.uv.array[i * 12 + 1] = 1;

                                geometry.attributes.uv.array[i * 12 + 2] = angle[i];
                                geometry.attributes.uv.array[i * 12 + 3] = 1;

                                geometry.attributes.uv.array[i * 12 + 4] = angle[i];
                                geometry.attributes.uv.array[i * 12 + 5] = 0;

                                geometry.attributes.uv.array[i * 12 + 6] = angle[i];
                                geometry.attributes.uv.array[i * 12 + 7] = 0;

                                geometry.attributes.uv.array[i * 12 + 8] = angle[i + 1];
                                geometry.attributes.uv.array[i * 12 + 9] = 0;

                                geometry.attributes.uv.array[i * 12 + 10] = angle[i + 1];
                                geometry.attributes.uv.array[i * 12 + 11] = 1;
                        }

                        deviation = Math.atan(0.46 * Math.tan(Math.PI / this.amount));

                        for (i = 0; i < this.amount; i++) {
                                angle = 2 * Math.PI * i / this.amount;

                                mesh = new THREE.Mesh(geometry, material);

                                mesh.rotation.z = Math.PI / 2 - angle;

                                mesh.position.x = this.apothem * Math.sin(angle + deviation);
                                mesh.position.y = this.apothem * Math.cos(angle + deviation);

                                this.add(mesh);

                                mesh = new THREE.Mesh(geometry, material);

                                mesh.rotation.z = Math.PI / 2 - angle;

                                mesh.position.x = this.apothem * Math.sin(angle - deviation);
                                mesh.position.y = this.apothem * Math.cos(angle - deviation);

                                this.add(mesh);
                        }

                        texture = null;
                        material = null;
                        geometry = null;
                        mesh = null;

                        return this;
                }
        }]);

        return Exits;
})(THREE.Object3D);

var Platform = (function (_THREE$Object3D4) {
        _inherits(Platform, _THREE$Object3D4);

        function Platform() {
                _classCallCheck(this, Platform);

                _get(Object.getPrototypeOf(Platform.prototype), 'constructor', this).call(this);

                var material, geometry, malla;

                //  ALFOMBRA RADIAL
                //  radioInt = 17.5, radioExt = 26.5, segmentos = 32
                material = new THREE.MeshBasicMaterial({
                        color: 0xFFFFFF,
                        side: THREE.FrontSide,
                        map: TEXTURES.REDCARPET
                });

                geometry = new _PlatformBufferGeometryJs2['default'](17.5, 27.5, 32);

                malla = new THREE.Mesh(geometry, material);
                malla.position.z = 1;
                this.add(malla);

                //  PLATAFORMA: CILINDRO EXTERIOR
                //  radioSup = 28.5, radioInf = 28.5, altura = 1, segmRadiales = 32, segmVerticales = 1, abierto = true
                material = new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        side: THREE.FrontSide
                });

                geometry = new THREE.CylinderGeometry(27.5, 27.5, 1, 32, 1, true);

                malla = new THREE.Mesh(geometry, material);
                malla.rotation.x = Math.PI / 2;
                malla.rotation.y = 11.25 * Math.PI / 180;
                malla.position.z = 0.5;
                this.add(malla);

                material = null;
                geometry = null;
                malla = null;
        }

        return Platform;
})(THREE.Object3D);

var TrialStands = (function (_THREE$Object3D5) {
        _inherits(TrialStands, _THREE$Object3D5);

        function TrialStands() {
                _classCallCheck(this, TrialStands);

                _get(Object.getPrototypeOf(TrialStands.prototype), 'constructor', this).call(this);

                var textura, material, geometry, malla, i, j, k;

                textura = TEXTURES.WOOD;

                //  BASES DE MADERA
                //  radioSup = 16.5, radioInf = 14.5, altura = 1, segmRadiales = 16, segmVerticales = 1, abierto = true
                material = new THREE.MeshLambertMaterial({
                        color: 0xFFFFFF,
                        emissive: 0x333333,
                        side: THREE.BackSide,
                        map: textura
                });

                geometry = new THREE.CylinderGeometry(17.5, 17.5 - 2, 1, 16, 1, true);
                geometry.faceVertexUvs[0] = [];
                j = [new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)];
                k = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];
                for (i = 0; i < 16; i++) {
                        geometry.faceVertexUvs[0].push(j);
                        geometry.faceVertexUvs[0].push(k);
                }

                malla = new THREE.Mesh(geometry, material);
                malla.name = 'platfront';
                malla.rotation.x = Math.PI / 2;
                malla.rotation.y = 11.25 * Math.PI / 180;
                malla.position.z = 0.5;
                this.add(malla);

                //  BANQUILLOS x16
                material = new THREE.MeshLambertMaterial({
                        color: 0xFFFFFF,
                        emissive: 0x222222,
                        side: THREE.FrontSide,
                        map: textura
                });

                geometry = [
                //  POSTE INTERMEDIO: distancia del centro = 19, posición z = 1
                new _StandGeometryJs2['default'](17, 1),
                //  SOPORTE SUPERIOR: ancho = 7, alto = 1.5, prof = 1
                new THREE.BoxGeometry(7, 1.5, 1),
                //  UNIÓN INFERIOR: ancho = 7, alto = 1.2, prof = 1
                new THREE.BoxGeometry(7, 1.2, 1)];

                for (i = 0; i < 16; i++) {
                        //      POSTE INTERMEDIO
                        malla = new THREE.Mesh(geometry[0], material);
                        malla.rotation.z = (i + 0.5) * 360 / 16 * Math.PI / 180;
                        this.add(malla);

                        //      SOPORTE SUPERIOR
                        malla = new THREE.Mesh(geometry[1], material);
                        malla.rotation.z = (90 + i * 360 / 16) * Math.PI / 180;
                        malla.position.x = 19.1 * Math.cos(i / 8 * Math.PI);
                        malla.position.y = 19.1 * Math.sin(i / 8 * Math.PI);
                        malla.position.z = 9.8;
                        this.add(malla);

                        //      UNIÓN INFERIOR
                        malla = new THREE.Mesh(geometry[2], material);
                        malla.rotation.z = (90 + i * 360 / 16) * Math.PI / 180;
                        malla.position.x = 17.5 * Math.cos(i / 8 * Math.PI);
                        malla.position.y = 17.5 * Math.sin(i / 8 * Math.PI);
                        malla.position.z = 1.6;
                        this.add(malla);
                }

                //  TUBO CIRCULAR
                //  radio = 18.2, diametro = 0.35, segmRadiales = 16, segmTubulares = 80
                textura = TEXTURES.CLOUDS;
                textura.wrapT = textura.wrapS = THREE.RepeatWrapping;
                textura.repeat.set(30, 1);

                material = new THREE.MeshLambertMaterial({
                        color: 0x33898F,
                        emissive: 0x33898F,
                        side: THREE.FrontSide,
                        map: textura
                });

                geometry = new THREE.TorusGeometry(16.2, 0.35, 10, 80);

                malla = new THREE.Mesh(geometry, material);
                malla.position.z = 10.1;
                this.add(malla);

                textura = material = geometry = malla = null;
        }

        return TrialStands;
})(THREE.Object3D);

Object.defineProperties(Courtroom, {
        TEXTURE_RELATIVE_URI: { value: '/resources/textures/' },
        CylinderBufferGeometry: { value: _CylinderBufferGeometryJs2['default'] },
        PlatformBufferGeometry: { value: _PlatformBufferGeometryJs2['default'] },
        StandGeometry: { value: _StandGeometryJs2['default'] },
        Floor: { value: Floor },
        Walls: { value: Walls },
        Exits: { value: Exits },
        Platform: { value: Platform },
        TrialStands: { value: TrialStands }
});

exports['default'] = Courtroom;
module.exports = exports['default'];

},{"./CylinderBufferGeometry.js":7,"./PlatformBufferGeometry.js":10,"./StandGeometry.js":13}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
        value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CylinderBufferGeometry = (function (_THREE$BufferGeometry) {
        _inherits(CylinderBufferGeometry, _THREE$BufferGeometry);

        function CylinderBufferGeometry(sides, height, apothem) {
                _classCallCheck(this, CylinderBufferGeometry);

                _get(Object.getPrototypeOf(CylinderBufferGeometry.prototype), 'constructor', this).call(this);

                this.type = 'CylinderBufferGeometry';

                var radius = apothem / Math.cos(Math.PI / sides);

                var s,
                    this_x,
                    this_y,
                    next_x,
                    next_y,
                    angle = 2 * Math.PI / sides,
                    vertices = new Float32Array(sides * 6 * 3),
                    uvs = new Float32Array(sides * 6 * 2);

                for (s = 0; s <= sides; s++) {
                        this_x = radius * Math.cos(angle * (s - 0.5));
                        this_y = radius * Math.sin(angle * (s - 0.5));
                        next_x = radius * Math.cos(angle * (s + 0.5));
                        next_y = radius * Math.sin(angle * (s + 0.5));

                        // (x,y) = 1,1 : Top right vertex
                        uvs[s * 12 + 0] = 1;
                        uvs[s * 12 + 1] = 1;
                        vertices[s * 18 + 0] = next_x;
                        vertices[s * 18 + 1] = next_y;
                        vertices[s * 18 + 2] = height;
                        // (x,y) = 0,1 : Top left vertex
                        uvs[s * 12 + 2] = 0;
                        uvs[s * 12 + 3] = 1;
                        vertices[s * 18 + 3] = this_x;
                        vertices[s * 18 + 4] = this_y;
                        vertices[s * 18 + 5] = height;
                        // (x,y) = 0,0 : Bottom left vertex
                        uvs[s * 12 + 4] = 0;
                        uvs[s * 12 + 5] = 0;
                        vertices[s * 18 + 6] = this_x;
                        vertices[s * 18 + 7] = this_y;
                        vertices[s * 18 + 8] = 0;

                        // (x,y) = 0,0 : Bottom left vertex
                        uvs[s * 12 + 6] = 0;
                        uvs[s * 12 + 7] = 0;
                        vertices[s * 18 + 9] = this_x;
                        vertices[s * 18 + 10] = this_y;
                        vertices[s * 18 + 11] = 0;
                        // (x,y) = 1,0 : Bottom right vertex
                        uvs[s * 12 + 8] = 1;
                        uvs[s * 12 + 9] = 0;
                        vertices[s * 18 + 12] = next_x;
                        vertices[s * 18 + 13] = next_y;
                        vertices[s * 18 + 14] = 0;
                        // (x,y) = 1,1 : Top right vertex
                        uvs[s * 12 + 10] = 1;
                        uvs[s * 12 + 11] = 1;
                        vertices[s * 18 + 15] = next_x;
                        vertices[s * 18 + 16] = next_y;
                        vertices[s * 18 + 17] = height;
                }

                this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

                this_x = this_y = null;
                next_x = next_y = null;
                uvs = null;
                vertices = null;
        }

        return CylinderBufferGeometry;
})(THREE.BufferGeometry);

exports['default'] = CylinderBufferGeometry;
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _StageJs = require('./Stage.js');

var _StageJs2 = _interopRequireDefault(_StageJs);

var _animationDiscussionAnimationJs = require('./animation/DiscussionAnimation.js');

var _animationDiscussionAnimationJs2 = _interopRequireDefault(_animationDiscussionAnimationJs);

var _hudDiscussionScreenJs = require('./hud/DiscussionScreen.js');

var _hudDiscussionScreenJs2 = _interopRequireDefault(_hudDiscussionScreenJs);

var DiscussionStage = (function (_Stage) {
	_inherits(DiscussionStage, _Stage);

	function DiscussionStage(trial) {
		_classCallCheck(this, DiscussionStage);

		_get(Object.getPrototypeOf(DiscussionStage.prototype), 'constructor', this).call(this, trial);

		this.screen = new _hudDiscussionScreenJs2['default'](this.hudRenderer.ctx);
		this.hudRenderer.screen = this.screen;

		this.animation = new _animationDiscussionAnimationJs2['default'](trial.renderer);
	}

	_createClass(DiscussionStage, [{
		key: 'render',
		value: function render(time) {
			this.sceneRenderer && this.sceneRenderer.render(time);
			this.hudRenderer && this.hudRenderer.render(time);
			this.audioRenderer && this.audioRenderer.render(time);
		}
	}, {
		key: 'promiseChainForDialogue',
		value: function promiseChainForDialogue(speaker, lines, thought) {
			var _this = this;

			var promise = Promise.resolve(true);

			var _loop = function (_line, _i) {
				promise = promise.then((function () {
					this.screen.setDialogue(this.characters[speaker], _line, thought);

					return new Promise(function (resolve) {
						setTimeout(resolve, Math.max(2500, _line.length * 50));
						_line = null;
						_i = null;
					});
				}).bind(_this));
				line = _line;
				i = _i;
			};

			for (var line = undefined, i = 0; line = lines[i]; i++) {
				_loop(line, i);
			}

			return promise;
		}
	}, {
		key: 'queueNarratorScript',
		value: function queueNarratorScript(block) {
			this.eventchain = this.eventchain.then((function () {
				var promises = [];

				promises[0] = this.promiseChainForDialogue(block.speaker, block.dialogue);
				this.animation.tutorial();

				return Promise.all(promises);
			}).bind(this));
		}
	}, {
		key: 'queueCharacterScript',
		value: function queueCharacterScript(block) {
			this.eventchain = this.eventchain.then((function () {
				var _this2 = this;

				var promises = [];

				promises[0] = this.promiseChainForDialogue(block.speaker, block.dialogue, block.thought);

				if ('sprite' in block) this.characters[block.speaker].sprite = block.sprite;

				promises[1] = Promise.resolve();

				if ('camera' in block) promises[1] = promises[1].then((function () {
					return this.animation.cutTo(block.camera);
				}).bind(this));

				if ('animation' in block) {
					var _loop2 = function (_i2) {
						promises[1] = promises[1].then((function () {
							return this.animation.transicion(block.animation[_i2]);
						}).bind(_this2));
					};

					for (var _i2 = 0; _i2 < block.animation.length; _i2++) {
						_loop2(_i2);
					}
				}

				return Promise.all(promises);
			}).bind(this));
		}
	}]);

	return DiscussionStage;
})(_StageJs2['default']);

exports['default'] = DiscussionStage;
module.exports = exports['default'];

},{"./Stage.js":12,"./animation/DiscussionAnimation.js":20,"./hud/DiscussionScreen.js":22}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
		value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var HudRenderer = (function () {
		function HudRenderer(width, height) {
				_classCallCheck(this, HudRenderer);

				this.W = width;
				this.H = height;

				var canvas = document.createElement('canvas');

				canvas.width = width;
				canvas.height = height;

				this.ctx = canvas.getContext('2d');

				this.blackScreen = 0;

				canvas = null;
		}

		_createClass(HudRenderer, [{
				key: 'drawBlackScreen',
				value: function drawBlackScreen(opacity) {
						this.ctx.save();

						this.ctx.globalAlpha = Math.min(this.blackScreen, 1);
						this.ctx.fillStyle = '#000000';
						this.ctx.fillRect(0, 0, this.W, this.H);

						this.ctx.restore();
				}
		}, {
				key: 'render',
				value: function render(time) {
						this.ctx.clearRect(0, 0, this.W, this.H);

						this.processor && this.processor(time);

						if (this.screen) this.screen.draw(time);

						if (this.blackScreen > 0) this.drawBlackScreen();
				}
		}, {
				key: 'canvas',
				get: function get() {
						return this.ctx.canvas;
				}
		}]);

		return HudRenderer;
})();

exports['default'] = HudRenderer;
module.exports = exports['default'];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
            value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlatformBufferGeometry = (function (_THREE$BufferGeometry) {
            _inherits(PlatformBufferGeometry, _THREE$BufferGeometry);

            function PlatformBufferGeometry(radiusInternal, radiusExternal, segments) {
                        _classCallCheck(this, PlatformBufferGeometry);

                        _get(Object.getPrototypeOf(PlatformBufferGeometry.prototype), 'constructor', this).call(this);

                        this.type = 'PlatformBufferGeometry';

                        radiusInternal = radiusInternal || 20;
                        radiusExternal = radiusExternal || 31;
                        segments = segments || 32;

                        var s,
                            this_x,
                            this_y,
                            next_x,
                            next_y,
                            angle = 2 * Math.PI / segments,
                            vertices = new Float32Array(segments * 6 * 3),
                            uvs = new Float32Array(segments * 6 * 2);

                        for (s = 0; s < segments; s++) {
                                    this_x = Math.cos(angle * s);
                                    this_y = Math.sin(angle * s);
                                    next_x = Math.cos(angle * (s + 1));
                                    next_y = Math.sin(angle * (s + 1));

                                    uvs[12 * s + 0] = 0;
                                    uvs[12 * s + 1] = 0;
                                    vertices[18 * s + 0] = radiusInternal * this_x;
                                    vertices[18 * s + 1] = radiusInternal * this_y;
                                    vertices[18 * s + 2] = 0;

                                    uvs[12 * s + 2] = 1;
                                    uvs[12 * s + 3] = 0;
                                    vertices[18 * s + 3] = radiusExternal * this_x;
                                    vertices[18 * s + 4] = radiusExternal * this_y;
                                    vertices[18 * s + 5] = 0;

                                    uvs[12 * s + 4] = 1;
                                    uvs[12 * s + 5] = 1;
                                    vertices[18 * s + 6] = radiusExternal * next_x;
                                    vertices[18 * s + 7] = radiusExternal * next_y;
                                    vertices[18 * s + 8] = 0;

                                    uvs[12 * s + 6] = 1;
                                    uvs[12 * s + 7] = 1;
                                    vertices[18 * s + 9] = radiusExternal * next_x;
                                    vertices[18 * s + 10] = radiusExternal * next_y;
                                    vertices[18 * s + 11] = 0;

                                    uvs[12 * s + 8] = 0;
                                    uvs[12 * s + 9] = 1;
                                    vertices[18 * s + 12] = radiusInternal * next_x;
                                    vertices[18 * s + 13] = radiusInternal * next_y;
                                    vertices[18 * s + 14] = 0;

                                    uvs[12 * s + 10] = 0;
                                    uvs[12 * s + 11] = 0;
                                    vertices[18 * s + 15] = radiusInternal * this_x;
                                    vertices[18 * s + 16] = radiusInternal * this_y;
                                    vertices[18 * s + 17] = 0;
                        }

                        this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                        this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
                        //this.computeVertexNormals();

                        this_x = this_y = null;
                        next_x = next_y = null;
                        uvs = null;
                        vertices = null;
            }

            return PlatformBufferGeometry;
})(THREE.BufferGeometry);

exports['default'] = PlatformBufferGeometry;
module.exports = exports['default'];

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
		value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _CharacterCardJs = require('./CharacterCard.js');

var _CharacterCardJs2 = _interopRequireDefault(_CharacterCardJs);

// I'm really tempted to extend WebGLRenderer for this,
// but it might break something.

var SceneRenderer = (function () {
		function SceneRenderer(width, height) {
				_classCallCheck(this, SceneRenderer);

				this.W = width;
				this.H = height;

				this.renderer = new THREE.WebGLRenderer({
						antialias: true
				});
				// preserveDrawingBuffer: true
				this.renderer.setPixelRatio(window.devicePixelRatio);
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

		_createClass(SceneRenderer, [{
				key: 'render',
				value: function render(time) {
						this.processor && this.processor(time);
						this.renderer.render(this.scene, this.mainCamera);
				}
		}, {
				key: 'createCamera',
				value: function createCamera(params) {
						var camera = new THREE.PerspectiveCamera(45, this.W / this.H, 1, 300);

						camera.position.set(10, 10, 10);
						camera.up.set(0, 0, 1);
						camera.lookAt(new THREE.Vector3(0, 0, 10));

						this.scene.add(camera);

						this.cameras.push(camera);
						this.mainCamera = camera;
				}
		}, {
				key: 'locateCharacter',
				value: function locateCharacter(character, position) {
						var card = new _CharacterCardJs2['default'](character);

						card.counter = Math.abs(position % 16);

						var ang = card.counter / 16 * (2 * Math.PI);

						card.rotation.x = Math.PI / 2;
						card.rotation.y = ang - Math.PI / 2;

						card.position.set((23 - 0.5 * Math.pow(-1, position)) * Math.cos(ang), (23 - 0.5 * Math.pow(-1, position)) * Math.sin(ang), 11);

						this.scene.add(card);

						ang = null;
				}

				// TODO: find a better way
		}, {
				key: 'heIsHere',
				value: function heIsHere(thebear) {
						var card = new _CharacterCardJs2['default'](thebear);

						card.front.geometry = card.back.geometry = new THREE.PlaneBufferGeometry(10, 10);

						card.rotation.x = Math.PI / 2;
						card.rotation.y = Math.PI / 2;

						card.position.set(-50, 0, 19);

						var cube = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 10), new THREE.MeshLambertMaterial({ color: 0xffcc00 }));

						cube.position.set(-50, 0, 7);

						cube.rotation.y = Math.PI / 2;

						this.scene.add(card);
						this.scene.add(cube);
				}

				// I still don't know how, but this will be useful for the Cross Sword Showdown
		}, {
				key: 'renderHalf',
				value: function renderHalf() {
						this.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
						this.renderer.clear();

						// Left side
						this.renderer.setViewport(1, 1, 0.5 * this.WIDTH - 2, this.HEIGHT - 2);
						this.renderer.render(this.scene, this.mainCamera);

						// Right side
						this.renderer.setViewport(0.5 * this.WIDTH + 1, 1, 0.5 * this.WIDTH - 2, this.HEIGHT - 2);
						this.renderer.render(this.scene, this.rightCamera);
				}
		}, {
				key: 'canvas',
				get: function get() {
						return this.renderer.domElement;
				}
		}]);

		return SceneRenderer;
})();

exports['default'] = SceneRenderer;
module.exports = exports['default'];

},{"./CharacterCard.js":4}],12:[function(require,module,exports){
/*
 * class STAGE
 *
 * The Stage object holds and controls all the children elements involved in the game.
 * Is composed, but not limited to, by
 * - a Scene Renderer: in this case, the Three.js WebGL Renderer,
 * - a HUD Renderer: can be the one included or a custom one,
 * - an Audio Renderer: work in progress
 *
 * Each stage of the game is controlled by a different subclass of this class, and will be switched
 * depending on the game's script.
 *
 * All the Renderers must have the same structure as a Three.js Renderer; a render() method
 * must be available to be called on every frame.
 *
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Stage = (function () {
	function Stage(trial) {
		_classCallCheck(this, Stage);

		this.characters = trial.characters;

		this.trial = trial;

		this.sceneRenderer = trial.renderer.scene;
		this.hudRenderer = trial.renderer.hud;
		this.audioRenderer = trial.renderer.audio;

		this.eventchain = Promise.resolve();
		this._func = [];

		this.cuadro = 0;
	}

	_createClass(Stage, [{
		key: 'render',
		value: function render(time) {
			throw new Error('Stage.render: Not implemented.');
		}
	}, {
		key: 'stop',
		value: function stop() {
			cancelAnimationFrame(this.cuadro);
			return this;
		}
	}, {
		key: 'step',
		value: function step(func) {
			this.cuadro = requestAnimationFrame(func.bind(this));
			return this;
		}
	}, {
		key: 'justKeepRendering',
		value: function justKeepRendering() {
			var transition = (function (time) {
				this.render(time);
				this.cuadro = requestAnimationFrame(transition);
			}).bind(this);

			this.cuadro = requestAnimationFrame(transition);
		}
	}, {
		key: 'next',
		value: function next(func) {
			this.eventchain = this.eventchain.then(func.bind(this));
			return this;
		}
	}, {
		key: 'nextPromise',
		value: function nextPromise(func) {
			this.eventchain = this.eventchain.then((function () {
				return new Promise(func.bind(this));
			}).bind(this));

			return this;
		}
	}, {
		key: 'delayPromise',
		value: function delayPromise(time) {
			return new Promise(function (resolve) {
				setTimeout(resolve, time);
			});
		}
	}, {
		key: 'end',
		value: function end(nextStage) {
			return this.eventchain.then((function () {
				return this.animation.exitSpin();
			}).bind(this)).then((function () {
				this.trial.changeStage(nextStage.kind);
				this.trial.loadScript(nextStage.file);
			}).bind(this));
		}
	}]);

	return Stage;
})();

exports['default'] = Stage;
module.exports = exports['default'];

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StandGeometry = (function (_THREE$Geometry) {
    _inherits(StandGeometry, _THREE$Geometry);

    function StandGeometry(dist, altu) {
        _classCallCheck(this, StandGeometry);

        _get(Object.getPrototypeOf(StandGeometry.prototype), "constructor", this).call(this);

        // Atril
        this.vertices.push(new THREE.Vector3(0.8, dist - 2, altu + 10.2), // 4 del frente   0
        new THREE.Vector3(-0.8, dist - 2, altu + 10.2), new THREE.Vector3(-0.8, dist - 2, altu + 8.7), new THREE.Vector3(0.8, dist - 2, altu + 8.7), new THREE.Vector3(0.8, dist + 4, altu + 10.2), // 4 detras      4
        new THREE.Vector3(-0.8, dist + 4, altu + 10.2), new THREE.Vector3(-0.8, dist + 4, altu + 8.5), new THREE.Vector3(0.8, dist + 4, altu + 8.5), new THREE.Vector3(0.8, dist + 0, altu + 7.5), // 4 debajo      8
        new THREE.Vector3(-0.8, dist + 0, altu + 7.5), new THREE.Vector3(-0.8, dist + 3, altu + 7.5), new THREE.Vector3(0.8, dist + 3, altu + 7.5));

        this.faces.push(new THREE.Face3(0, 1, 2), // Frente
        new THREE.Face3(2, 3, 0), new THREE.Face3(3, 2, 9), new THREE.Face3(9, 8, 3), new THREE.Face3(4, 5, 1), // Arriba
        new THREE.Face3(1, 0, 4), new THREE.Face3(4, 0, 3), // Derecha
        new THREE.Face3(3, 7, 4), new THREE.Face3(7, 3, 8), new THREE.Face3(8, 11, 7), new THREE.Face3(1, 5, 6), // Izquierda
        new THREE.Face3(6, 2, 1), new THREE.Face3(2, 6, 10), new THREE.Face3(10, 9, 2), new THREE.Face3(5, 4, 7), // Atrás
        new THREE.Face3(7, 6, 5), new THREE.Face3(6, 7, 11), new THREE.Face3(11, 10, 6), new THREE.Face3(8, 9, 10), // Abajo
        new THREE.Face3(10, 11, 8));

        // Poste
        this.vertices.push(new THREE.Vector3(0.6, dist + 0.2, altu + 7.5), // 4 del frente, 12
        new THREE.Vector3(-0.6, dist + 0.2, altu + 7.5), new THREE.Vector3(-0.6, dist + 0.2, altu + 1.1), new THREE.Vector3(0.6, dist + 0.2, altu + 1.1), new THREE.Vector3(-0.6, dist + 2.8, altu + 7.5), // 4 de atrás
        new THREE.Vector3(0.6, dist + 2.8, altu + 7.5), new THREE.Vector3(0.6, dist + 2.8, altu + 1.1), new THREE.Vector3(-0.6, dist + 2.8, altu + 1.1));

        this.faces.push(new THREE.Face3(12, 13, 14), new THREE.Face3(14, 15, 12), new THREE.Face3(16, 17, 18), new THREE.Face3(18, 19, 16), new THREE.Face3(17, 12, 15), new THREE.Face3(15, 18, 17), new THREE.Face3(13, 16, 19), new THREE.Face3(19, 14, 13));

        // Base
        this.vertices.push(new THREE.Vector3(0.8, dist + 0, altu + 1.4), // 4 del frente
        new THREE.Vector3(-0.8, dist + 0, altu + 1.4), new THREE.Vector3(-0.8, dist + 0, altu + 0.0), new THREE.Vector3(0.8, dist + 0, altu + 0.0), new THREE.Vector3(-0.8, dist + 3, altu + 1.4), // 2 superiores
        new THREE.Vector3(0.8, dist + 3, altu + 1.4), new THREE.Vector3(0.8, dist + 4, altu + 0.7), // 2 del bisel
        new THREE.Vector3(-0.8, dist + 4, altu + 0.7), new THREE.Vector3(0.8, dist + 4, altu + 0.0), // 2 inferiores
        new THREE.Vector3(-0.8, dist + 4, altu + 0.0));

        this.faces.push(new THREE.Face3(20, 21, 22), new THREE.Face3(22, 23, 20), new THREE.Face3(25, 24, 21), new THREE.Face3(21, 20, 25), new THREE.Face3(20, 23, 28), new THREE.Face3(28, 26, 20), new THREE.Face3(26, 25, 20), new THREE.Face3(24, 25, 26), new THREE.Face3(26, 27, 24), new THREE.Face3(27, 26, 28), new THREE.Face3(28, 29, 27), new THREE.Face3(21, 24, 27), new THREE.Face3(21, 27, 29), new THREE.Face3(21, 29, 22));

        var n = this.faces.length / 2,
            j = [new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)],
            k = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];

        this.faceVertexUvs[0] = [];
        while (n--) this.faceVertexUvs[0].push(j, k);

        this.computeFaceNormals();
        this.computeVertexNormals();
    }

    return StandGeometry;
})(THREE.Geometry);

exports["default"] = StandGeometry;
module.exports = exports["default"];

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Trayectoria = (function () {
	function Trayectoria() {
		_classCallCheck(this, Trayectoria);

		this.geometry = new THREE.SphereGeometry(0.5, 3, 2);
		// this.material = new THREE.MeshBasicMaterial({ color: Math.floor(Math.random() * 0xFFFFFF) });
	}

	_createClass(Trayectoria, [{
		key: "getVector",
		value: function getVector(t) {
			return {
				x: this.getX(t),
				y: this.getY(t),
				z: this.getZ(t)
			};
		}
	}, {
		key: "getVector3",
		value: function getVector3(t) {
			return new THREE.Vector3(this.getX(t), this.getY(t), this.getZ(t));
		}

		// drawStep(scene, t)
		// {
		// 	let esfera = new THREE.Mesh(this.geometry, this.material);
		// 	esfera.position.copy(this.getVector(t));
		// 	scene.add(esfera);
		// 	return esfera;
		// }

	}, {
		key: "drawPath",
		value: function drawPath(scene) {
			var obj = undefined,
			    material = new THREE.LineBasicMaterial({ color: Math.floor(Math.random() * 0xFFFFFF) }),
			    geometry = new THREE.Geometry();

			for (var i = 0; i <= 1; i += 0.1) {
				geometry.vertices.push(this.getVector3(i));
			}obj = new THREE.Line(geometry, material);
			scene.add(obj);
			return obj;
		}
	}]);

	return Trayectoria;
})();

exports["default"] = Trayectoria;
module.exports = exports["default"];

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _TrayectoriaJs = require('./Trayectoria.js');

var _TrayectoriaJs2 = _interopRequireDefault(_TrayectoriaJs);

var TrayectoriaCircular = (function (_Trayectoria) {
	_inherits(TrayectoriaCircular, _Trayectoria);

	function TrayectoriaCircular(start, end, center) {
		_classCallCheck(this, TrayectoriaCircular);

		_get(Object.getPrototypeOf(TrayectoriaCircular.prototype), 'constructor', this).call(this);

		center = center || {};

		this.cx = center.x || 0;
		this.cy = center.y || 0;

		this.ax = start.x - this.cx;
		this.bx = end.x - this.cx;

		this.ay = start.y - this.cy;
		this.by = end.y - this.cy;

		this.az = start.z;
		this.dz = end.z - start.z;

		this.ar = Math.sqrt(this.ax * this.ax + this.ay * this.ay);
		this.br = Math.sqrt(this.bx * this.bx + this.by * this.by);

		this.ap = Math.atan2(this.ay, this.ax);
		this.bp = Math.atan2(this.by, this.bx);

		// Shortest path fix
		if (this.bp - this.ap > Math.PI) this.ap += 2 * Math.PI;else if (this.bp - this.ap < -Math.PI) this.bp += 2 * Math.PI;

		start = null;
		end = null;
		center = null;
	}

	_createClass(TrayectoriaCircular, [{
		key: 'getX',
		value: function getX(t) {
			return this.cx + this.getR(t) * Math.cos(this.getP(t));
		}
	}, {
		key: 'getY',
		value: function getY(t) {
			return this.cy + this.getR(t) * Math.sin(this.getP(t));
		}
	}, {
		key: 'getZ',
		value: function getZ(t) {
			return this.az + t * this.dz;
		}
	}, {
		key: 'getR',
		value: function getR(t) {
			return (1 - t) * this.ar + t * this.br;
		}
	}, {
		key: 'getP',
		value: function getP(t) {
			return (1 - t) * this.ap + t * this.bp;
		}
	}]);

	return TrayectoriaCircular;
})(_TrayectoriaJs2['default']);

exports['default'] = TrayectoriaCircular;
module.exports = exports['default'];

},{"./Trayectoria.js":14}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _TrayectoriaJs = require('./Trayectoria.js');

var _TrayectoriaJs2 = _interopRequireDefault(_TrayectoriaJs);

var TrayectoriaEsferica = (function (_Trayectoria) {
	_inherits(TrayectoriaEsferica, _Trayectoria);

	function TrayectoriaEsferica(start, end, center) {
		_classCallCheck(this, TrayectoriaEsferica);

		_get(Object.getPrototypeOf(TrayectoriaEsferica.prototype), 'constructor', this).call(this, start, end);

		center = center || {};

		this.cx = center.x || 0;
		this.cy = center.y || 0;
		this.cz = center.z || 0;

		this.ax = start.x - this.cx;
		this.ay = start.y - this.cy;
		this.az = start.z - this.cz;

		this.ar = Math.sqrt(this.ax * this.ax + this.ay * this.ay + this.az * this.az);
		this.ap = Math.atan2(this.ay, this.ax);
		this.at = Math.acos(this.az / Math.sqrt(this.ax * this.ax + this.ay * this.ay + this.az * this.az));

		this.bx = end.x - this.cx;
		this.by = end.y - this.cy;
		this.bz = end.z - this.cz;

		this.br = Math.sqrt(this.bx * this.bx + this.by * this.by + this.bz * this.bz);
		this.bp = Math.atan2(this.by, this.bx);
		this.bt = Math.acos(this.bz / Math.sqrt(this.bx * this.bx + this.by * this.by + this.bz * this.bz));

		// Shortest path fix
		if (this.bp - this.ap > Math.PI) this.ap += 2 * Math.PI;else if (this.bp - this.ap < -Math.PI) this.bp += 2 * Math.PI;

		start = null;
		end = null;
		center = null;
	}

	_createClass(TrayectoriaEsferica, [{
		key: 'getX',
		value: function getX(t) {
			if (this.path == 'spherical') return this.cx + this.getR(t) * Math.sin(this.getT(t)) * Math.cos(this.getP(t));

			if (this.path == 'circular') return this.cx + this.getR(t) * Math.cos(this.getP(t));

			return (1 - t) * this.ax + t * this.bx;
		}
	}, {
		key: 'getY',
		value: function getY(t) {
			if (this.path == 'spherical') return this.cy + this.getR(t) * Math.sin(this.getT(t)) * Math.sin(this.getP(t));

			if (this.path == 'circular') return this.cy + this.getR(t) * Math.sin(this.getP(t));

			return (1 - t) * this.ay + t * this.by;
		}
	}, {
		key: 'getZ',
		value: function getZ(t) {
			if (this.path == 'spherical') return this.cz + this.getR(t) * Math.cos(this.getT(t));

			return (1 - t) * this.az + t * this.bz;
		}
	}, {
		key: 'getR',
		value: function getR(t) {
			return (1 - t) * this.ar + t * this.br;
		}
	}, {
		key: 'getP',
		value: function getP(t) {
			return (1 - t) * this.ap + t * this.bp;
		}
	}, {
		key: 'getT',
		value: function getT(t) {
			return (1 - t) * this.at + t * this.bt;
		}
	}]);

	return TrayectoriaEsferica;
})(_TrayectoriaJs2['default']);

exports['default'] = TrayectoriaEsferica;
module.exports = exports['default'];

},{"./Trayectoria.js":14}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _TrayectoriaJs = require('./Trayectoria.js');

var _TrayectoriaJs2 = _interopRequireDefault(_TrayectoriaJs);

var TrayectoriaLineal = (function (_Trayectoria) {
	_inherits(TrayectoriaLineal, _Trayectoria);

	function TrayectoriaLineal(start, end) {
		_classCallCheck(this, TrayectoriaLineal);

		_get(Object.getPrototypeOf(TrayectoriaLineal.prototype), 'constructor', this).call(this);

		this.ax = start.x;
		this.ay = start.y;
		this.az = start.z;

		this.dx = end.x - start.x;
		this.dy = end.y - start.y;
		this.dz = end.z - start.z;

		start = null;
		end = null;
	}

	_createClass(TrayectoriaLineal, [{
		key: 'getX',
		value: function getX(t) {
			return this.ax + t * this.dx;
		}
	}, {
		key: 'getY',
		value: function getY(t) {
			return this.ay + t * this.dy;
		}
	}, {
		key: 'getZ',
		value: function getZ(t) {
			return this.az + t * this.dz;
		}
	}]);

	return TrayectoriaLineal;
})(_TrayectoriaJs2['default']);

exports['default'] = TrayectoriaLineal;
module.exports = exports['default'];

},{"./Trayectoria.js":14}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _CharacterJs = require('./Character.js');

var _CharacterJs2 = _interopRequireDefault(_CharacterJs);

var _DiscussionStageJs = require('./DiscussionStage.js');

var _DiscussionStageJs2 = _interopRequireDefault(_DiscussionStageJs);

var Trial = (function () {
	function Trial(width, height) {
		_classCallCheck(this, Trial);

		this.W = width;
		this.H = height;

		this.characters = {};
		this.renderer = {};

		this.stage = null;
	}

	_createClass(Trial, [{
		key: 'setupRenderer',
		value: function setupRenderer(type, renderer) {
			this.renderer[type] = renderer;
			return this;
		}
	}, {
		key: 'setNarrator',
		value: function setNarrator(nametag) {
			this.characters.narrator = new _CharacterJs2['default']({
				id: _CharacterJs2['default'].NARRATOR,
				name: nametag
			});
		}
	}, {
		key: 'setCharacter',
		value: function setCharacter(character, position) {
			if (!character) return;

			character = new _CharacterJs2['default'](character);
			this.characters[character.id] = character;

			this.renderer.scene.locateCharacter(character, position);
		}
	}, {
		key: 'putTheFuckingBear',
		value: function putTheFuckingBear() {
			var kuma = new _CharacterJs2['default']({
				id: 'monokuma',
				name: 'Monokuma'
			});
			this.characters.monokuma = kuma;

			this.renderer.scene.heIsHere(kuma);
		}
	}, {
		key: 'changeStage',
		value: function changeStage(mode) {
			switch (mode) {
				case 'discussion':
					this.stage = new _DiscussionStageJs2['default'](this);
					break;

				// case 'nsd':
				// 	this.stage = new NSDStage(this);
				// 	break;
			}
		}
	}, {
		key: 'loadScript',
		value: function loadScript(url) {
			fetch(url).then(function (res) {
				return res.json();
			}).then((function (script) {
				script.forEach(this.parseScript, this);
			}).bind(this));
		}
	}, {
		key: 'parseScript',
		value: function parseScript(block) {
			if (block.kind) {
				this.stage.end(block);
			} else {
				if (block.speaker == 'narrator') {
					this.stage.queueNarratorScript(block);
				} else {
					this.stage.queueCharacterScript(block);
				}
			}
		}
	}]);

	return Trial;
})();

exports['default'] = Trial;
module.exports = exports['default'];

},{"./Character.js":3,"./DiscussionStage.js":8}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _CoordenadaJs = require('./Coordenada.js');

var _CoordenadaJs2 = _interopRequireDefault(_CoordenadaJs);

var _TrayectoriaLinealJs = require('./TrayectoriaLineal.js');

var _TrayectoriaLinealJs2 = _interopRequireDefault(_TrayectoriaLinealJs);

var _TrayectoriaCircularJs = require('./TrayectoriaCircular.js');

var _TrayectoriaCircularJs2 = _interopRequireDefault(_TrayectoriaCircularJs);

var _TrayectoriaEsfericaJs = require('./TrayectoriaEsferica.js');

var _TrayectoriaEsfericaJs2 = _interopRequireDefault(_TrayectoriaEsfericaJs);

var _easingJs = require('./easing.js');

var _easingJs2 = _interopRequireDefault(_easingJs);

var Videographer = (function () {
	function Videographer(duration, path, easing) {
		_classCallCheck(this, Videographer);

		this.duration = duration;
		this.path = path || 'linear';
		this.easing = easing || 'linear';
	}

	_createClass(Videographer, [{
		key: 'getPosition',
		value: function getPosition(time) {
			return this.position.getVector(this.position.easing(time));
		}
	}, {
		key: 'getDirection',
		value: function getDirection(time) {
			return this.direction.getVector(this.direction.easing(time));
		}
	}, {
		key: 'getFOV',
		value: function getFOV(time) {
			return this.fov.start + this.fov.delta * this.fov.easing(time);
		}
	}, {
		key: 'getUp',
		value: function getUp(time) {
			return this.up.getVector(this.up.easing(time));
		}
	}, {
		key: 'setupPosition',
		value: function setupPosition(start, end, params) {
			switch (params.path || this.path) {
				case 'circular':
					this.position = new _TrayectoriaCircularJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end), params.center);
					break;

				case 'spherical':
					this.position = new _TrayectoriaEsfericaJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end), params.center);
					break;

				case 'linear':
				default:
					this.position = new _TrayectoriaLinealJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end));
					break;
			}

			this.position.easing = _easingJs2['default'][params.easing || this.easing];

			params = null;
		}
	}, {
		key: 'setupDirection',
		value: function setupDirection(start, end, params) {
			switch (params.path || this.path) {
				case 'circular':
					this.direction = new _TrayectoriaCircularJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end), params.center);
					break;

				case 'spherical':
					this.direction = new _TrayectoriaEsfericaJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end), params.center);
					break;

				case 'linear':
				default:
					this.direction = new _TrayectoriaLinealJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end));
					break;
			}

			this.direction.easing = _easingJs2['default'][params.easing || this.easing];

			params = null;
		}
	}, {
		key: 'setupFOV',
		value: function setupFOV(start, end, params) {
			this.fov = {
				start: start,
				delta: end - start,
				easing: _easingJs2['default'][params.easing || this.easing]
			};

			params = null;
		}
	}, {
		key: 'setupUp',
		value: function setupUp(start, end, params) {
			switch (params.path || this.path) {
				case 'circular':
					this.up = new _TrayectoriaCircularJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end), params.center);
					break;

				case 'spherical':
					this.up = new _TrayectoriaEsfericaJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end), params.center);
					break;

				case 'linear':
				default:
					this.up = new _TrayectoriaLinealJs2['default'](_CoordenadaJs2['default'].parse(start), _CoordenadaJs2['default'].parse(end));
					break;
			}

			this.up.easing = _easingJs2['default'][params.easing || this.easing];

			params = null;
		}
	}, {
		key: 'runStage',
		value: function runStage(camera, time) {
			this.fov && (camera.fov = this.getFOV(time)) && camera.updateProjectionMatrix();
			this.position && camera.position.copy(this.getPosition(time));
			this.up && camera.up.copy(this.getUp(time));
			// direction MUST be the last property to change
			this.direction && camera.lookAt(this.getDirection(time));
		}
	}, {
		key: 'delta',
		value: function delta(now) {
			this.start || (this.start = now);
			return (now - this.start) / this.duration;
		}
	}]);

	return Videographer;
})();

exports['default'] = Videographer;
module.exports = exports['default'];

},{"./Coordenada.js":5,"./TrayectoriaCircular.js":15,"./TrayectoriaEsferica.js":16,"./TrayectoriaLineal.js":17,"./easing.js":21}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _CoordenadaJs = require('./../Coordenada.js');

var _CoordenadaJs2 = _interopRequireDefault(_CoordenadaJs);

var _TrayectoriaJs = require('./../Trayectoria.js');

var _TrayectoriaJs2 = _interopRequireDefault(_TrayectoriaJs);

var _AnimationJs = require('./../Animation.js');

var _AnimationJs2 = _interopRequireDefault(_AnimationJs);

var DiscussionAnimation = (function (_Animation) {
	_inherits(DiscussionAnimation, _Animation);

	function DiscussionAnimation(renderers) {
		_classCallCheck(this, DiscussionAnimation);

		_get(Object.getPrototypeOf(DiscussionAnimation.prototype), 'constructor', this).call(this, renderers);
	}

	_createClass(DiscussionAnimation, [{
		key: 'randomDialogue',
		value: function randomDialogue() {
			var transition,
			    inicio,
			    dir_x,
			    dir_y,
			    char = juicio.characters[Object.keys(juicio.characters)[Math.floor(Math.random() * 15)]],
			    counter = char.card.counter;

			screen.setDialogue(char, 'I actually looked at the crime scene for more than 2 seconds, something you should try to do sometimes...');

			juicio.mainCamera.up.x = (Math.random() - 0.5) / 2;
			juicio.mainCamera.up.z = 5;
			juicio.mainCamera.up.normalize();

			dir_x = 0.5 * (Math.random() - 0.5);
			dir_y = 10 * (Math.random() - 0.5);

			transition = function (t) {
				var delta = (t - inicio) / 10000,
				    ang = 2 * Math.PI * (counter + dir_x * delta) / 16;

				juicio.mainCamera.position.set((9 + dir_y * delta) * Math.cos(ang), (9 + dir_y * delta) * Math.sin(ang), 16);

				juicio.mainCamera.lookAt({
					x: 25 * Math.cos(ang),
					y: 25 * Math.sin(ang),
					z: 16
				});

				juicio.render(t);
				_AnimationJs2['default'].step(transition);
			};

			juicio.animation.stop();
			inicio = window.performance.now() + 5000;
			_AnimationJs2['default'].step(transition);
		}
	}, {
		key: 'tutorial',
		value: function tutorial() {
			return new Promise((function (end) {
				this.mainCamera.up.set(0, 0, 1);
				this.mainCamera.fov = 40;
				this.mainCamera.updateProjectionMatrix();

				this.processor = function (now) {
					var angle = 2 * Math.PI * (now % 60000) / 60000;

					// pos: 28, 0, 33
					this.mainCamera.position.set(-28 * Math.cos(angle), -28 * Math.sin(angle), 33);
					// look: -19, 0, 9
					this.mainCamera.lookAt(new THREE.Vector3(19 * Math.cos(angle), 19 * Math.sin(angle), 9));
				};
			}).bind(this.scene));
		}
	}, {
		key: 'cuestionamiento',
		value: function cuestionamiento(param) {
			return this.cutTo({
				fov: 40,
				up: new _CoordenadaJs2['default'](0, 0, 1),
				position: _CoordenadaJs2['default'].parse({ r: 10, p: param.azimuth, z: 17 }),
				direction: _CoordenadaJs2['default'].parse({ r: 26, p: param.azimuth, z: 15 })
			}).then((function () {
				return this.transicion({
					fov: 54,
					duration: (param.duration || 600) * 4 / 7,
					position: _CoordenadaJs2['default'].parse({ r: 3, p: param.azimuth, z: 16 }),
					direction: _CoordenadaJs2['default'].parse({ r: 26, p: param.azimuth, z: 15 }),
					easing: 'outQuad'
				});
			}).bind(this)).then((function () {
				return this.transicion({
					fov: 60,
					duration: (param.duration || 600) * 3 / 7,
					position: _CoordenadaJs2['default'].parse({ r: 10, p: param.azimuth, z: 17 }),
					direction: _CoordenadaJs2['default'].parse({ r: 26, p: param.azimuth, z: 15 }),
					easing: 'inCubic'
				});
			}).bind(this));
		}
	}, {
		key: 'exitSpin',
		value: function exitSpin() {
			return new Promise((function (end) {
				var inicio,
				    initial_up = _CoordenadaJs2['default'].parse(this.scene.mainCamera.up),
				    initial_pos = _CoordenadaJs2['default'].parse(this.scene.mainCamera.position),
				    initial_look = _CoordenadaJs2['default'].parse(new THREE.Vector3(0, 0, -10).applyMatrix4(this.scene.mainCamera.matrixWorld)),
				    up = {
					r: initial_up.r,
					dp: initial_up.p - initial_pos.p,
					z: initial_up.z
				},
				    look = {
					r: initial_look.r,
					dp: initial_look.p - initial_pos.p,
					z: initial_look.z
				};

				initial_look = null;
				initial_up = null;

				this.hud.processor = function (now) {
					var delta = (now - inicio) / 1000;

					if (delta >= 2) {
						this.processor = null;
						end();
					} else if (delta > 1) this.blackScreen = delta - 1;else this.blackScreen = 0;
				};

				this.scene.processor = function (now) {
					inicio || (inicio = now);

					var delta = (now - inicio) / 1000,
					    angle = initial_pos.p - delta * Math.PI;

					this.mainCamera.position.set(initial_pos.r * Math.cos(angle), initial_pos.r * Math.sin(angle), initial_pos.z * (1 - delta / 2) + 19 * delta / 2);
					this.mainCamera.lookAt(new THREE.Vector3(look.r * Math.cos(angle + look.dp), look.r * Math.sin(angle + look.dp), look.z * (1 - delta / 2) + 19 * delta / 2));
					this.mainCamera.up.set(up.r * Math.cos(angle + up.dp), up.r * Math.sin(angle + up.dp), up.z);

					if (delta >= 2) {
						inicio = null;
						initial_pos = null;
						this.processor = null;
					}
				};
			}).bind(this));
		}
	}]);

	return DiscussionAnimation;
})(_AnimationJs2['default']);

exports['default'] = DiscussionAnimation;
module.exports = exports['default'];

},{"./../Animation.js":2,"./../Coordenada.js":5,"./../Trayectoria.js":14}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = {
    // t: start time, b: begInnIng value, c: change In value, d: duration
    none: function none() {
        return 1;
    },
    linear: function linear(x) {
        return x;
    },
    inQuad: function inQuad(x) {
        return x * x;
    },
    outQuad: function outQuad(x) {
        return -x * (x - 2);
    },
    inOutQuad: function inOutQuad(x) {
        return 0.5 * ((x *= 2) < 1 ? x * x : x * (2 - x) - 2);
    },
    inCubic: function inCubic(x) {
        return x * x * x;
    },
    outCubic: function outCubic(x) {
        return Math.pow(x - 1, 3) + 1;
    },
    inOutCubic: function inOutCubic(x) {
        return 0.5 * ((x *= 2) < 1 ? x * x * x : Math.pow(2 * x - 2, 3) + 2);
    }, /*
       easeInQuart: function (x) {
         return c * (t /= d) * t * t * t;
       },
       easeOutQuart: function (x) {
         return -c * ((t = t / d - 1) * t * t * t - 1);
       },
       easeInOutQuart: function (x) {
         if ((t /= d / 2) < 1)
             return c / 2 * t * t * t * t;
         return -c / 2 * ((t -= 2) * t * t * t - 2);
       },
       easeInQuint: function (x) {
         return c * (t /= d) * t * t * t * t;
       },
       easeOutQuint: function (x) {
         return c * ((t = t / d - 1) * t * t * t * t + 1);
       },
       easeInOutQuint: function (x) {
         if ((t /= d / 2) < 1)
             return c / 2 * t * t * t * t * t;
         return c / 2 * ((t -= 2) * t * t * t * t + 2);
       },*/
    inSine: function inSine(x) {
        return 1 - Math.cos(x * Math.PI / 2);
    },
    outSine: function outSine(x) {
        return Math.sin(x * Math.PI / 2);
    },
    inOutSine: function inOutSine(x) {
        return -0.5 * (Math.cos(Math.PI * x) - 1);
    },
    easeInExpo: function easeInExpo(x) {
        return Math.pow(1024, x - 1);
    },
    easeOutExpo: function easeOutExpo(x) {
        return 1.0009765626 - Math.pow(1024, -x);
    },
    easeInOutExpo: function easeInOutExpo(x) {
        return 0.5 * ((x *= 2) < 1 ? Math.pow(1024, x - 1) : 2 - Math.pow(1024, 1 - x));
    }
};
module.exports = exports["default"];

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
		value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ScreenJs = require('./Screen.js');

var _ScreenJs2 = _interopRequireDefault(_ScreenJs);

var _TextElementJs = require('./TextElement.js');

var _TextElementJs2 = _interopRequireDefault(_TextElementJs);

var _CharacterJs = require('./../Character.js');

var DiscussionScreen = (function (_BaseScreen) {
		_inherits(DiscussionScreen, _BaseScreen);

		function DiscussionScreen(ctx) {
				_classCallCheck(this, DiscussionScreen);

				_get(Object.getPrototypeOf(DiscussionScreen.prototype), 'constructor', this).call(this, ctx);

				this.gradients = (function () {
						var width = ctx.canvas.width,
						    protagDiscLeft = ctx.createLinearGradient(0, 0, width, 0),
						    labelDiscLeft = ctx.createLinearGradient(0, 0, width, 0),
						    labelDiscRight = ctx.createLinearGradient(0, 0, width, 0);

						protagDiscLeft.addColorStop(0, '#CC0000');
						protagDiscLeft.addColorStop(0.65, 'rgb(255, 51, 51)');
						protagDiscLeft.addColorStop(0.75, 'rgba(255, 51, 51, 0)');

						labelDiscLeft.addColorStop(0.65, 'rgb(255, 51, 51)');
						labelDiscLeft.addColorStop(0.75, 'rgba(255, 51, 51, 0)');

						labelDiscRight.addColorStop(0.65, 'rgb(255, 51, 51)');
						labelDiscRight.addColorStop(0.75, 'rgba(255, 51, 51, 0)');

						return {
								nameprotagLeft: protagDiscLeft,
								nametagLeft: labelDiscLeft,
								nametagRight: labelDiscRight
						};
				})();

				this.caseNumber = '02';

				this.banner_x = 0;

				this.speakerCardTimer = 0;
				this.speakerCardImage = new Image();
				this.speakerCardImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

				this.dialogue = new _TextElementJs2['default'](ctx);
				this.dialogue.x = 0.05 * this.W;
				this.dialogue.y = 0.8 * this.H;
				this.dialogue.typewrite = true;

				this.nametag = new _TextElementJs2['default'](ctx);
				this.nametag.x = 0.03 * this.W;
				this.nametag.y = 0.675 * this.H;
				this.nametag.font = 0.04 * this.H + 'px Aero, sans-serif';

				this.add(this.dialogue, this.nametag);
		}

		_createClass(DiscussionScreen, [{
				key: 'setDialogue',
				value: function setDialogue(speaker, text, thought) {
						if (this.speakerId != speaker.id) {
								this.generateInterferencePattern();
								this.interferenceOpacity = 1;

								this.nametag.marginLeft = 0.04 * this.W;
								this.nametag.opacity = 0;
						}

						this.speakerId = speaker.id;
						this.speakerIsProtagonist = speaker.card && speaker.card.counter == 0;
						this.speakerCardImage.src = speaker.bustSpriteUri;

						this.nametag.text = speaker.name.split("").join(String.fromCharCode(8202));

						this.dialogue.text = text;
						this.dialogue.typewLength = 0;

						if (thought) this.dialogue.color = this.constructor.COLOR_THOUGHT;else if (speaker.id == _CharacterJs.NARRATOR) this.dialogue.color = this.constructor.COLOR_NARRATOR;else this.dialogue.color = this.constructor.COLOR_CHARACTER;
				}
		}, {
				key: 'generateInterferencePattern',
				value: function generateInterferencePattern() {
						this.interferencePattern = this.ctx.createLinearGradient(0, 0.08 * this.H, 0, 0.63 * this.H);

						var n,
						    guidea = '0',
						    guideb = '0',
						    y = Math.floor(this.H / 100);

						while (y--) {
								guidea += Math.floor(Math.random() * 500).toString(2);
								guideb += Math.floor(Math.random() * 500).toString(2);
						}

						n = y = Math.min(guidea.length, guideb.length);

						while (y--) {
								if (guidea[y] != guideb[y]) {
										this.interferencePattern.addColorStop(y / n - 0.005, '#ff3333');
										this.interferencePattern.addColorStop(y / n, '#ffffff');
										this.interferencePattern.addColorStop(y / n + 0.005, '#ff3333');
								}
						}
				}
		}, {
				key: 'drawClassTrialBanner',
				value: function drawClassTrialBanner() {
						this.ctx.save();

						this.ctx.font = 0.08 * this.H + 'px Goodbye Despair';
						this.ctx.globalAlpha = 0.5;
						this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
						this.ctx.strokeStyle = 'white';
						this.ctx.lineWidth = this.H / 500;

						var width = this.ctx.measureText('class trial ').width;

						this.ctx.fillText('class trial class trial class trial class trial class trial ', this.banner_x, 0.06 * this.H);
						this.ctx.strokeText('class trial class trial class trial class trial class trial ', this.banner_x, 0.06 * this.H);

						this.banner_x -= this.W / 1000;
						if (this.banner_x < -width) this.banner_x += width;

						width = null;

						this.ctx.restore();
				}
		}, {
				key: 'drawSpeakerCard',
				value: function drawSpeakerCard() {
						var y,
						    width = 0.19 * this.W;

						this.speakerCardTimer += 0.03;

						if (this.speakerCardTimer >= 1) this.speakerCardTimer = -1;

						this.ctx.save();

						// Black background
						this.ctx.fillStyle = 'black';
						this.ctx.fillRect(0, 0, width, 0.63 * this.H);

						// "CASE" background polygon
						this.ctx.beginPath();
						this.ctx.moveTo(0, 0);
						this.ctx.lineTo(0.1 * this.W, 0);
						this.ctx.lineTo(0.1 * this.W + 0.07 * this.H, 0.07 * this.H);
						this.ctx.lineTo(0, 0.07 * this.H);
						this.ctx.closePath();

						this.ctx.fillStyle = '#999999';
						this.ctx.fill();

						this.ctx.font = 0.06 * this.H + 'px Goodbye Despair';

						// "CASE"
						this.ctx.fillStyle = '#ffffff';
						this.ctx.fillText('case', 0.01 * this.W, 0.054 * this.H);

						// Case number
						this.ctx.textAlign = 'right';
						this.ctx.fillStyle = '#ff3333';
						this.ctx.fillText(this.caseNumber, 0.19 * this.W - 0.01 * this.H, 0.054 * this.H);

						this.ctx.restore();

						this.ctx.save();

						this.ctx.beginPath();
						this.ctx.rect(0, 0.075 * this.H, width - 0.005 * this.H, 0.55 * this.H);
						this.ctx.clip();

						// Card image background gradient
						var gradient = this.ctx.createLinearGradient(0, (0.08 - 1.1 + 0.55 * this.speakerCardTimer) * this.H, 0, (0.08 + 1.1 + 0.55 * this.speakerCardTimer) * this.H);
						gradient.addColorStop(0, '#FF0000');
						gradient.addColorStop(0.25, '#000000');
						gradient.addColorStop(0.5, '#FF0000');
						gradient.addColorStop(0.75, '#000000');
						gradient.addColorStop(1, '#FF0000');

						this.ctx.fillStyle = gradient;
						this.ctx.fillRect(0, 0, width, this.H);

						gradient = null;

						this.ctx.strokeStyle = '#' + ('0' + Math.floor(Math.abs(this.speakerCardTimer * 255)).toString(16)).slice(-2) + '0000';
						this.ctx.lineWidth = this.H / 200;
						// Card image background line pattern
						y = 0.625 + width / this.H;
						while (y > 0.075) {
								this.ctx.beginPath();
								this.ctx.moveTo(width - 0.0025 * this.H, y * this.H);
								this.ctx.lineTo(-0.0025 * this.H, y * this.H - width);
								this.ctx.stroke();
								y -= 0.03;
						}

						y = 1.6 * 0.55 * this.H;
						this.ctx.drawImage(this.speakerCardImage, (width - y / this.speakerCardImage.naturalHeight * this.speakerCardImage.naturalWidth) / 2, 0.075 * this.H, y / this.speakerCardImage.naturalHeight * this.speakerCardImage.naturalWidth, y);

						if (this.interferenceOpacity > 0) {
								this.ctx.globalAlpha = this.interferenceOpacity;
								this.ctx.fillStyle = this.interferencePattern;
								this.ctx.fillRect(0, 0.075 * this.H, width, 0.55 * this.H);

								this.interferenceOpacity -= 0.08;
						}

						this.ctx.restore();

						this.ctx.strokeStyle = '#ffffff';
						this.ctx.lineWidth = this.H / 500;

						// White line next to case number
						this.ctx.beginPath();
						this.ctx.moveTo(width - 0.005 * this.H, 0);
						this.ctx.lineTo(width - 0.005 * this.H, 0.07 * this.H);
						this.ctx.stroke();

						// White line around card image
						this.ctx.strokeRect(-0.005 * this.H, 0.075 * this.H, width, 0.55 * this.H);

						this.ctx.restore();

						width = null;
				}
		}, {
				key: 'drawDialogBackground',
				value: function drawDialogBackground() {
						this.ctx.save();

						this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
						this.ctx.fillRect(0, this.H * 0.69, this.W, this.H * 0.31);

						this.ctx.fillStyle = this.gradients[this.speakerIsProtagonist ? 'nameprotagLeft' : 'nametagLeft'];
						this.ctx.fillRect(0, this.H * 0.63, this.W, this.H * 0.06);

						this.ctx.fillStyle = 'white';
						this.ctx.fillRect(0, this.H * 0.693, this.W, this.H * 0.02);

						this.ctx.fillStyle = '#FF0066';
						this.ctx.fillRect(0, this.H * 0.713, this.W, this.H * 0.01);

						this.ctx.restore();
				}
		}, {
				key: 'draw',
				value: function draw(time) {
						this.ctx.clearRect(0, 0, this.W, this.H);

						this.drawClassTrialBanner();
						this.drawDialogBackground();

						if (this.speakerId != _CharacterJs.NARRATOR) this.drawSpeakerCard();

						this.dialogue.draw();

						if (this.nametag.marginLeft > 0) this.nametag.marginLeft -= 0.005 * this.W;
						if (this.nametag.opacity < 1) this.nametag.opacity += 0.1;
						this.nametag.draw();
				}
		}]);

		return DiscussionScreen;
})(_ScreenJs2['default']);

DiscussionScreen.COLOR_NARRATOR = '#47FF19';
DiscussionScreen.COLOR_CHARACTER = 'white';
DiscussionScreen.COLOR_THOUGHT = '#5ac3d8';

exports['default'] = DiscussionScreen;
module.exports = exports['default'];

},{"./../Character.js":3,"./Screen.js":24,"./TextElement.js":25}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var HUDElement = (function () {
	function HUDElement(ctx) {
		_classCallCheck(this, HUDElement);

		this.type = 'HUD.Element';

		this.ctx = ctx;
		this.W = ctx.canvas.width;
		this.H = ctx.canvas.height;

		this.relative_x = 0;
		this.relative_y = 0;

		this.visible = true;
		this.opacity = 1;

		this.parent = undefined;
		this.children = [];

		this.events = {};
	}

	// Shamelessly stolen from THREE.js

	_createClass(HUDElement, [{
		key: 'add',
		value: function add(object) {
			if (arguments.length > 1) {
				for (var i = 0; i < arguments.length; i++) this.add(arguments[i]);

				return this;
			};

			if (object === this) {
				console.error("HUD.Element$add: object can't be added as a child of itself.", object);
				return this;
			}

			if (object instanceof HUDElement) {
				if (object.parent !== undefined) {
					object.parent.remove(object);
				}

				object.parent = this;
				object.dispatchEvent({ 'type': 'added' });

				this.children.push(object);
			} else {
				console.error("HUD.Element$add: object not an instance of HUDElement.", object);
			}

			return this;
		}
	}, {
		key: 'remove',
		value: function remove(object) {
			if (arguments.length > 1) {
				for (var i = 0; i < arguments.length; i++) this.remove(arguments[i]);
			};

			var index = this.children.indexOf(object);

			if (index !== -1) {
				object.parent = undefined;
				object.dispatchEvent({ 'type': 'removed' });
				this.children.splice(index, 1);
			}
		}
	}, {
		key: 'getChildrenByType',
		value: function getChildrenByType(type) {
			var result = [],
			    n = this.children.length;

			while (n--) {
				if (this.children[n].type == type) result.push(this.children[n]);

				if (this.children[n].children.length > 0) result = result.concat(this.children[n].getChildrenByType(type));
			}

			return result;
		}
	}, {
		key: 'getChildByType',
		value: function getChildByType(type) {
			var result,
			    i = 0,
			    n = this.children.length;

			for (var i = 0; i < this.children.length; i++) {
				if (this.children[n].type == type) {
					return this.children[n];
				}

				if (this.children[n].children.length > 0) {
					result = this.children[n].getChildByType(type);

					if (result) return result;
				}
			}
		}
	}, {
		key: 'dispatchEvent',
		value: function dispatchEvent(object) {
			if (object.type in this.events) {
				this.events[object.type].forEach(function (callback) {
					callback(object);
				});
			}
		}
	}, {
		key: 'listenEvent',
		value: function listenEvent(type, callback) {
			if (!(type in this.events)) this.events[type] = [];

			this.events[type].push(callback);
		}
	}, {
		key: 'draw',
		value: function draw(time) {
			throw new Error('HUD.Element$draw: Method not implemented.', this.type);
		}
	}, {
		key: 'drawChildren',
		value: function drawChildren(time) {
			for (var child = undefined, i = 0; child = this.children[i]; i++) {
				child.draw(time);
			}
		}
	}]);

	return HUDElement;
})();

exports['default'] = HUDElement;
module.exports = exports['default'];

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ElementJs = require('./Element.js');

var _ElementJs2 = _interopRequireDefault(_ElementJs);

var Interface = (function (_BaseElement) {
	_inherits(Interface, _BaseElement);

	function Interface(ctx) {
		_classCallCheck(this, Interface);

		_get(Object.getPrototypeOf(Interface.prototype), 'constructor', this).call(this, ctx);

		this.type = 'HUD.Screen';
	}

	return Interface;
})(_ElementJs2['default']);

exports['default'] = Interface;
module.exports = exports['default'];

},{"./Element.js":23}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ElementJs = require('./Element.js');

var _ElementJs2 = _interopRequireDefault(_ElementJs);

var TextElement = (function (_Element) {
	_inherits(TextElement, _Element);

	function TextElement(ctx, text, speaker) {
		_classCallCheck(this, TextElement);

		_get(Object.getPrototypeOf(TextElement.prototype), 'constructor', this).call(this, ctx);

		this.type = 'HUD.TextElement';

		this.text = text || '';
		this.color = 'white';

		this.x = 0;
		this.y = 0;

		this.maxWidth = 0.9 * this.W;
		this.marginLeft = 0;

		this.font = 0.06 * this.H + 'px Calibri';
		this.color = 'white';
		this.lineHeight = 0.08 * this.H;

		this.typewrite = false;
		this.typewLength = 0;
	}

	_createClass(TextElement, [{
		key: 'draw',
		value: function draw(time) {
			this.ctx.save();

			this.ctx.globalAlpha = this.opacity;
			this.ctx.fillStyle = this.color;
			this.ctx.font = this.font;

			this.writeLine(this.text, this.marginLeft + this.x, this.y, this.maxWidth);

			this.ctx.restore();
		}
	}, {
		key: 'typewriteStep',
		value: function typewriteStep(text) {
			if (text.length > this.typewLength) this.typewLength += 1;

			return text.substr(0, this.typewLength);
		}
	}, {
		key: 'writeLine',
		value: function writeLine(text, x, y, maxWidth) {
			if (this.typewrite) text = this.typewriteStep(text);

			var lastWord = '',
			    size = this.ctx.measureText(text).width,
			    currentLine = text.split(' '),
			    nextLine = [];

			while (size > maxWidth) {
				lastWord = currentLine.pop();
				nextLine.unshift(lastWord);
				text = currentLine.join(' ');
				size = this.ctx.measureText(text).width;
			}

			if (currentLine.length > 0) {
				this.ctx.fillText(text, x, y);

				if (nextLine.length > 0) this.writeLine(nextLine.join(' '), x, y + this.lineHeight, maxWidth);
			} else {
				throw new Error('TextElement: El texto contiene una palabra más ancha que el ancho máximo del canvas.');
			}

			lastWord = null;
			size = null;
			currentLine = null;
			nextLine = null;
		}
	}, {
		key: 'draw2',
		value: function draw2(ctx) {
			var rem = text.substr(this.textAdvance),
			   
			// if ' ' not in text, use text.length, else use position
			space = (rem.indexOf(' ') + 1 || text.length + 1) - 1,
			    wordwidth = this.ctx.measureText(rem.substring(0, space)).width;
			var w = ctx.measureText(str.charAt(i)).width;
			if (cursorX + wordwidth >= canvas.width - padding) {
				cursorX = startX;
				cursorY += lineHeight;
			}
			ctx.fillText(str.charAt(i), cursorX, cursorY);
			i++;
			cursorX += w;
		}
	}]);

	return TextElement;
})(_ElementJs2['default']);

exports['default'] = TextElement;
module.exports = exports['default'];

},{"./Element.js":23}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvZGlzY28vZGFuZ2FuZW5naW5lL3B1YmxpYy9kaXNjdXNzaW9uL2luZGV4LmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvQW5pbWF0aW9uLmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvQ2hhcmFjdGVyLmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvQ2hhcmFjdGVyQ2FyZC5qcyIsIi9kaXNjby9kYW5nYW5lbmdpbmUvc3JjL0Nvb3JkZW5hZGEuanMiLCIvZGlzY28vZGFuZ2FuZW5naW5lL3NyYy9Db3VydHJvb20uanMiLCIvZGlzY28vZGFuZ2FuZW5naW5lL3NyYy9DeWxpbmRlckJ1ZmZlckdlb21ldHJ5LmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvRGlzY3Vzc2lvblN0YWdlLmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvSHVkUmVuZGVyZXIuanMiLCIvZGlzY28vZGFuZ2FuZW5naW5lL3NyYy9QbGF0Zm9ybUJ1ZmZlckdlb21ldHJ5LmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvU2NlbmVSZW5kZXJlci5qcyIsIi9kaXNjby9kYW5nYW5lbmdpbmUvc3JjL1N0YWdlLmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvU3RhbmRHZW9tZXRyeS5qcyIsIi9kaXNjby9kYW5nYW5lbmdpbmUvc3JjL1RyYXllY3RvcmlhLmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvVHJheWVjdG9yaWFDaXJjdWxhci5qcyIsIi9kaXNjby9kYW5nYW5lbmdpbmUvc3JjL1RyYXllY3RvcmlhRXNmZXJpY2EuanMiLCIvZGlzY28vZGFuZ2FuZW5naW5lL3NyYy9UcmF5ZWN0b3JpYUxpbmVhbC5qcyIsIi9kaXNjby9kYW5nYW5lbmdpbmUvc3JjL1RyaWFsLmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvVmlkZW9ncmFwaGVyLmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvYW5pbWF0aW9uL0Rpc2N1c3Npb25BbmltYXRpb24uanMiLCIvZGlzY28vZGFuZ2FuZW5naW5lL3NyYy9lYXNpbmcuanMiLCIvZGlzY28vZGFuZ2FuZW5naW5lL3NyYy9odWQvRGlzY3Vzc2lvblNjcmVlbi5qcyIsIi9kaXNjby9kYW5nYW5lbmdpbmUvc3JjL2h1ZC9FbGVtZW50LmpzIiwiL2Rpc2NvL2RhbmdhbmVuZ2luZS9zcmMvaHVkL1NjcmVlbi5qcyIsIi9kaXNjby9kYW5nYW5lbmdpbmUvc3JjL2h1ZC9UZXh0RWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OzswQkNFa0Isb0JBQW9COzs7OzhCQUNoQix3QkFBd0I7Ozs7OEJBQ3hCLHdCQUF3Qjs7OzsrQkFFdkIseUJBQXlCOzs7O2tDQUV0Qiw0QkFBNEI7Ozs7Z0NBQzlCLDBCQUEwQjs7OztBQUVsRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBVztBQUN4RCxLQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVTtLQUM1QixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDOztBQUVyQyxLQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ2hDLFFBQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQzVCLE9BQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7RUFDcEM7O0FBRUQsS0FBSSxNQUFNLEdBQUcsNEJBQVUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUV0QyxLQUFJLEtBQUssR0FBRyxvQ0FBa0IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLE1BQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNyQixNQUFLLENBQUMsVUFBVSxDQUFDLGlDQUFhLENBQUMsQ0FBQztBQUNoQyxPQUFNLENBQUMsYUFB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SyxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTVFLFFBQUksS0FBSyxJQUFJLEtBQUssRUFDakIsRUFBRSxDQUFDLFFBQVEsQ0FDVixLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsRUFDMUIsS0FBSyxDQUFDLEdBQUcsQ0FDVCxDQUFDOztBQUVILFFBQUksVUFBVSxJQUFJLEtBQUssRUFDdEIsRUFBRSxDQUFDLGFBQWEsQ0FDZixLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFDaEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsRUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FDZCxDQUFDOztBQUVILFFBQUksSUFBSSxJQUFJLEtBQUssRUFDaEIsRUFBRSxDQUFDLE9BQU8sQ0FDVCxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFDcEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsRUFDeEIsS0FBSyxDQUFDLEVBQUUsQ0FDUixDQUFDOztBQUVILFFBQUksV0FBVyxJQUFJLEtBQUssRUFDdkIsRUFBRSxDQUFDLGNBQWMsQ0FDaEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFDL0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFDdEMsS0FBSyxDQUFDLFNBQVMs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Qyx3Q0FBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELHdDQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTlDLHdDQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELHdDQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTlDLHdDQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELHdDQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQ2pEOztBQUVELGlDQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUU5RCw2QkFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlCLHFDQUFLLEdBQUcsQUFBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFHeEMsb0NBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUUxQyxvQ0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDOztBQUV0QyxvQ0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQztBQUM3RCxvQ0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQzs7QUFFN0Qsb0NBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBR2Ysb0NBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUUxQyxvQ0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDOztBQUV0QyxvQ0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQztBQUM3RCxvQ0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQzs7QUFFN0Qsb0NBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7eUJBQ2xCOztBQUVELCtCQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ2YsZ0NBQVEsR0FBRyxJQUFJLENBQUM7QUFDaEIsZ0NBQVEsR0FBRyxJQUFJLENBQUM7QUFDaEIsNEJBQUksR0FBRyxJQUFJLENBQUM7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TUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUEsQUFBQyxDQUFDLENBQUM7OztBQUc5QywyQkFBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLDJCQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsZ0NBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUM5QixnQ0FBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQzlCLGdDQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7O0FBRTlCLDJCQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsMkJBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQixnQ0FBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQzlCLGdDQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDOUIsZ0NBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQzs7QUFFOUIsMkJBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQiwyQkFBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLGdDQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDOUIsZ0NBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUM5QixnQ0FBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7QUFHekIsMkJBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQiwyQkFBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLGdDQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDOUIsZ0NBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUMvQixnQ0FBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUxQiwyQkFBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLDJCQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsZ0NBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUMvQixnQ0FBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQy9CLGdDQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTFCLDJCQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsMkJBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixnQ0FBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxD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LENBQUMsRUFDekIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLFlBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUN4QixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDekIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3pCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixZQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDeEIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQ3pCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUMxQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDekIsWUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQ3pCLENBQUM7OztBQUdOLFlBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNkLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQzlDLFlBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsRUFDL0MsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUMvQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUM5QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQy9DLFlBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQzlDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQzlDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsQ0FDOUMsQ0FBQzs7QUFFTixZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDWCxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQzFCLENBQUM7OztBQUdOLFlBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNkLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQzVDLFlBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsRUFDN0MsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUM3QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUM1QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQzdDLFlBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQzVDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQzVDLFlBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsRUFDN0MsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxHQUFHLENBQUM7QUFDNUMsWUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUM1QyxDQUFDOztBQUVOLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUNYLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFB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LENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMvRSxNQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkMsTUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBR3BHLE1BQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQzFCLE1BQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQzFCLE1BQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDOztBQUUxQixNQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMvRSxNQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkMsTUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztBQUdwRyxNQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUM5QixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQ25CLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFDcEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7QUFFeEIsT0FBSyxHQUFHLElBQUksQ0FBQztBQUNiLEtBQUcsR0FBRyxJQUFJLENBQUM7QUFDWCxRQUFNLEdBQUcsSUFBSSxDQUFDO0VBQ2Q7O2NBdENtQixtQkFBbUI7O1NBd0NuQyxjQUFDLENBQUMsRUFDTjtBQUNDLE9BQUksSUFBSSxDQUFDLElBQUksSUFBSSxXQUFXLEVBQzNCLE9BQU8sSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVqRixPQUFJLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVSxFQUMxQixPQUFPLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFeEQsVUFBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0dBQ3ZDOzs7U0FFRyxjQUFDLENBQUMsRUFDTjtBQUNDLE9BQUksSUFBSSxDQUFDLElBQUksSUFBSSxXQUFXLEVBQzNCLE9BQU8sSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVqRixPQUFJLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVSxFQUMxQixPQUFPLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFeEQsVUFBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0dBQ3ZDOzs7U0FFRyxjQUFDLENBQUMsRUFDTjtBQUNDLE9BQUksSUFBSSxDQUFDLElBQUksSUFBSSxXQUFXLEVBQzNCLE9BQU8sSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4RCxVQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7R0FDdkM7OztTQUVHLGNBQUMsQ0FBQyxFQUNOO0FBQ0MsVUFBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0dBQ3ZDOzs7U0FFRyxjQUFDLENBQUMsRUFDTjtBQUNDLFVBQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztHQUN2Qzs7O1NBRUcsY0FBQyxDQUFDLEVBQ047QUFDQyxVQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7R0FDdkM7OztRQW5GbUIsbUJBQW1COzs7cUJBQW5CLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJDRmhCLGtCQUFrQjs7OztJQUVyQixpQkFBaUI7V0FBakIsaUJBQWlCOztBQUUxQixVQUZTLGlCQUFpQixDQUV6QixLQUFLLEVBQUUsR0FBRyxFQUN0Qjt3QkFIb0IsaUJBQWlCOztBQUlwQyw2QkFKbUIsaUJBQWlCLDZDQUk1Qjs7QUFFUixNQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEIsTUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLE1BQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFbEIsTUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDMUIsTUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDMUIsTUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTFCLE9BQUssR0FBRyxJQUFJLENBQUM7QUFDYixLQUFHLEdBQUcsSUFBSSxDQUFDO0VBQ1g7O2NBaEJtQixpQkFBaUI7O1NBa0JqQyxjQUFDLENBQUMsRUFDTjtBQUNDLFVBQU8sSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztHQUM3Qjs7O1NBRUcsY0FBQyxDQUFDLEVBQ047QUFDQyxVQUFPLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7R0FDN0I7OztTQUVHLGNBQUMsQ0FBQyxFQUNOO0FBQ0MsVUFBTyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0dBQzdCOzs7UUEvQm1CLGlCQUFpQjs7O3FCQUFqQixpQkFBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJDRmhCLGdCQUFnQjs7OztpQ0FFVixzQkFBc0I7Ozs7SUFFN0IsS0FBSztBQUVkLFVBRlMsS0FBSyxDQUViLEtBQUssRUFBRSxNQUFNLEVBQ3pCO3dCQUhvQixLQUFLOztBQUl4QixNQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNmLE1BQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDOztBQUVoQixNQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNyQixNQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIsTUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7RUFDbEI7O2NBWG1CLEtBQUs7O1NBYVosdUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFDNUI7QUFDQyxPQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUMvQixVQUFPLElBQUksQ0FBQztHQUNaOzs7U0FFVSxxQkFBQyxPQUFPLEVBQ25CO0FBQ0MsT0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsNkJBQWM7QUFDeEMsTUFBRSxFQUFFLHlCQUFVLFFBQVE7QUFDdEIsUUFBSSxFQUFFLE9BQU87SUFDYixDQUFDLENBQUM7R0FDSDs7O1NBRVcsc0JBQUMsU0FBUyxFQUFFLFFBQVEsRUFDaEM7QUFDQyxPQUFJLENBQUMsU0FBUyxFQUNiLE9BQU87O0FBRVIsWUFBUyxHQUFHLDZCQUFjLFNBQVMsQ0FBQyxDQUFDO0FBQ3JDLE9BQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQzs7QUFFMUMsT0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUN6RDs7O1NBRWdCLDZCQUNqQjtBQUNDLE9BQUksSUFBSSxHQUFHLDZCQUFjO0FBQ3hCLE1BQUUsRUFBRSxVQUFVO0FBQ2QsUUFBSSxFQUFFLFVBQVU7SUFDaEIsQ0FBQyxDQUFDO0FBQ0gsT0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVoQyxPQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbkM7OztTQUVVLHFCQUFDLElBQUksRUFDaEI7QUFDQyxXQUFRLElBQUk7QUFFWCxTQUFLLFlBQVk7QUFDaEIsU0FBSSxDQUFDLEtBQUssR0FBRyxtQ0FBb0IsSUFBSSxDQUFDLENBQUM7QUFDdkMsV0FBTTs7QUFBQTs7O0lBS1A7R0FDRDs7O1NBRVMsb0JBQUMsR0FBRyxFQUNkO0FBQ0MsUUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUNSLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUNwQixXQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNsQixDQUFDLENBQ0QsSUFBSSxDQUFDLENBQUEsVUFBVSxNQUFNLEVBQUU7QUFDdkIsVUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNmOzs7U0FFVSxxQkFBQyxLQUFLLEVBQ2pCO0FBQ0MsT0FBSSxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQ2YsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEIsTUFBTTtBQUNOLFFBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxVQUFVLEVBQUU7QUFDaEMsU0FBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0QyxNQUFNO0FBQ04sU0FBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2QztJQUNEO0dBQ0Q7OztRQXJGbUIsS0FBSzs7O3FCQUFMLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJDSkgsaUJBQWlCOzs7O21DQUVWLHdCQUF3Qjs7OztxQ0FDdEIsMEJBQTBCOzs7O3FDQUMxQiwwQkFBMEI7Ozs7d0JBRXpDLGFBQWE7Ozs7SUFFVCxZQUFZO0FBRXJCLFVBRlMsWUFBWSxDQUVwQixRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFDbEM7d0JBSG9CLFlBQVk7O0FBSS9CLE1BQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLFFBQVEsQ0FBQztBQUM3QixNQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxRQUFRLENBQUM7RUFDakM7O2NBUG1CLFlBQVk7O1NBU3JCLHFCQUFDLElBQUksRUFDaEI7QUFDQyxVQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUM7R0FDN0Q7OztTQUVXLHNCQUFDLElBQUksRUFDakI7QUFDQyxVQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUM7R0FDL0Q7OztTQUVLLGdCQUFDLElBQUksRUFDWDtBQUNDLFVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDL0Q7OztTQUVJLGVBQUMsSUFBSSxFQUNWO0FBQ0MsVUFBTyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDO0dBQ2pEOzs7U0FFWSx1QkFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFDaEM7QUFDQyxXQUFRLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUk7QUFFL0IsU0FBSyxVQUFVO0FBQ2QsU0FBSSxDQUFDLFFBQVEsR0FBRyx1Q0FDZiwwQkFBVyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ3ZCLDBCQUFXLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FDWixDQUFDO0FBQ0gsV0FBTTs7QUFBQSxBQUVQLFNBQUssV0FBVztBQUNmLFNBQUksQ0FBQyxRQUFRLEdBQUcsdUNBQ2YsMEJBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUN2QiwwQkFBVyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQ3JCLE1BQU0sQ0FBQyxNQUFNLENBQ1osQ0FBQztBQUNILFdBQU07O0FBQUEsQUFFUCxTQUFLLFFBQVEsQ0FBQztBQUNkO0FBQ0MsU0FBSSxDQUFDLFFBQVEsR0FBRyxxQ0FDZiwwQkFBVyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ3ZCLDBCQUFXLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FDcEIsQ0FBQztBQUNILFdBQU07QUFBQSxJQUNQOztBQUVELE9BQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLHNCQUFLLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUxRCxTQUFNLEdBQUcsSUFBSSxDQUFDO0dBQ2Q7OztTQUVhLHdCQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUNqQztBQUNDLFdBQVEsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSTtBQUUvQixTQUFLLFVBQVU7QUFDZCxTQUFJLENBQUMsU0FBUyxHQUFHLHVDQUNoQiwwQkFBVyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ3ZCLDBCQUFXLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FDWixDQUFDO0FBQ0gsV0FBTTs7QUFBQSxBQUVQLFNBQUssV0FBVztBQUNmLFNBQUksQ0FBQyxTQUFTLEdBQUcsdUNBQ2hCLDBCQUFXLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDdkIsMEJBQVcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUNyQixNQUFNLENBQUMsTUFBTSxDQUNaLENBQUM7QUFDSCxXQUFNOztBQUFBLEFBRVAsU0FBSyxRQUFRLENBQUM7QUFDZDtBQUNDLFNBQUksQ0FBQyxTQUFTLEdBQUcscUNBQ2hCLDBCQUFXLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDdkIsMEJBQVcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUNwQixDQUFDO0FBQ0gsV0FBTTtBQUFBLElBQ1A7O0FBRUQsT0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsc0JBQUssTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNELFNBQU0sR0FBRyxJQUFJLENBQUM7R0FDZDs7O1NBRU8sa0JBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQzNCO0FBQ0MsT0FBSSxDQUFDLEdBQUcsR0FBRztBQUNWLFNBQUssRUFBRSxLQUFLO0FBQ1osU0FBSyxFQUFFLEdBQUcsR0FBRyxLQUFLO0FBQ2xCLFVBQU0sRUFBRSxzQkFBSyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDMUMsQ0FBQzs7QUFFRixTQUFNLEdBQUcsSUFBSSxDQUFDO0dBQ2Q7OztTQUVNLGlCQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUMxQjtBQUNDLFdBQVEsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSTtBQUUvQixTQUFLLFVBQVU7QUFDZCxTQUFJLENBQUMsRUFBRSxHQUFHLHVDQUNULDBCQUFXLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDdkIsMEJBQVcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUNyQixNQUFNLENBQUMsTUFBTSxDQUNaLENBQUM7QUFDSCxXQUFNOztBQUFBLEFBRVAsU0FBSyxXQUFXO0FBQ2YsU0FBSSxDQUFDLEVBQUUsR0FBRyx1Q0FDVCwwQkFBVyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ3ZCLDBCQUFXLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FDWixDQUFDO0FBQ0gsV0FBTTs7QUFBQSxBQUVQLFNBQUssUUFBUSxDQUFDO0FBQ2Q7QUFDQyxTQUFJLENBQUMsRUFBRSxHQUFHLHFDQUNULDBCQUFXLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDdkIsMEJBQVcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUNwQixDQUFDO0FBQ0gsV0FBTTtBQUFBLElBQ1A7O0FBRUQsT0FBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsc0JBQUssTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBELFNBQU0sR0FBRyxJQUFJLENBQUM7R0FDZDs7O1NBRU8sa0JBQUMsTUFBTSxFQUFFLElBQUksRUFDckI7QUFDQyxPQUFJLENBQUMsR0FBRyxLQUFLLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQSxBQUFFLElBQUksTUFBTSxDQUFDLHNCQUFzQixFQUFFLENBQUM7QUFDakYsT0FBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUM7QUFDaEUsT0FBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUM7O0FBRTlDLE9BQUksQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUM7R0FDM0Q7OztTQUVJLGVBQUMsR0FBRyxFQUNUO0FBQ0MsT0FBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQSxBQUFDLENBQUM7QUFDakMsVUFBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBLEdBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztHQUMxQzs7O1FBM0ptQixZQUFZOzs7cUJBQVosWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJDUlYsb0JBQW9COzs7OzZCQUNuQixxQkFBcUI7Ozs7MkJBQ3ZCLG1CQUFtQjs7OztJQUVwQixtQkFBbUI7V0FBbkIsbUJBQW1COztBQUU1QixVQUZTLG1CQUFtQixDQUUzQixTQUFTLEVBQ3JCO3dCQUhvQixtQkFBbUI7O0FBSXRDLDZCQUptQixtQkFBbUIsNkNBSWhDLFNBQVMsRUFBRTtFQUNqQjs7Y0FMbUIsbUJBQW1COztTQU96QiwwQkFDZDtBQUNDLE9BQUksVUFBVTtPQUNiLE1BQU07T0FDTixLQUFLO09BQUUsS0FBSztPQUNaLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDeEYsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDOztBQUU3QixTQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSwyR0FBMkcsQ0FBQyxDQUFDOztBQUV0SSxTQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQ25ELFNBQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsU0FBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWpDLFFBQUssR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQSxBQUFDLENBQUM7QUFDcEMsUUFBSyxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFBLEFBQUMsQ0FBQzs7QUFFbkMsYUFBVSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQ3pCLFFBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQSxHQUFJLEtBQUs7UUFDL0IsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFBLEFBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXBELFVBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDN0IsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQ25DLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNuQyxFQUFFLENBQ0QsQ0FBQzs7QUFFSCxVQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQ3JCLE1BQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDckIsTUFBQyxFQUFFLEVBQUU7S0FDTCxDQUFDLENBQUM7O0FBRUgsVUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQiw2QkFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0IsQ0FBQTs7QUFFRCxTQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hCLFNBQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUN6Qyw0QkFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDM0I7OztTQUVPLG9CQUNSO0FBQ0MsVUFBTyxJQUFJLE9BQU8sQ0FBQyxDQUFBLFVBQVUsR0FBRyxFQUFFO0FBQ2pDLFFBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUN6QixRQUFJLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxHQUFHLEVBQUU7QUFDL0IsU0FBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQSxBQUFDLEdBQUcsS0FBSyxDQUFDOzs7QUFHaEQsU0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFL0UsU0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDekYsQ0FBQztJQUNGLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7R0FDcEI7OztTQUVjLHlCQUFDLEtBQUssRUFDckI7QUFDQyxVQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDakIsT0FBRyxFQUFFLEVBQUU7QUFDUCxNQUFFLEVBQUUsOEJBQWUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsWUFBUSxFQUFFLDBCQUFXLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQzlELGFBQVMsRUFBRSwwQkFBVyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMvRCxDQUFDLENBQ0QsSUFBSSxDQUFDLENBQUEsWUFBVztBQUNoQixXQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDdEIsUUFBRyxFQUFFLEVBQUU7QUFDUCxhQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQSxHQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3pDLGFBQVEsRUFBRSwwQkFBVyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUM3RCxjQUFTLEVBQUUsMEJBQVcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDL0QsV0FBTSxFQUFFLFNBQVM7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUNaLElBQUksQ0FBQyxDQUFBLFlBQVc7QUFDaEIsV0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3RCLFFBQUcsRUFBRSxFQUFFO0FBQ1AsYUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUEsR0FBSSxDQUFDLEdBQUcsQ0FBQztBQUN6QyxhQUFRLEVBQUUsMEJBQVcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDOUQsY0FBUyxFQUFFLDBCQUFXLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQy9ELFdBQU0sRUFBRSxTQUFTO0tBQ2pCLENBQUMsQ0FBQztJQUNILENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNkOzs7U0FFTyxvQkFDUjtBQUNDLFVBQU8sSUFBSSxPQUFPLENBQUMsQ0FBQSxVQUFVLEdBQUcsRUFBRTtBQUNqQyxRQUFJLE1BQU07UUFDVCxVQUFVLEdBQUcsMEJBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUN2RCxXQUFXLEdBQUcsMEJBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUM5RCxZQUFZLEdBQUcsMEJBQVcsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdHLEVBQUUsR0FBRztBQUNKLE1BQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNmLE9BQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0FBQ2hDLE1BQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUNmO1FBQ0QsSUFBSSxHQUFHO0FBQ04sTUFBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2pCLE9BQUUsRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0FBQ2xDLE1BQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztLQUNqQixDQUFDOztBQUVILGdCQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGNBQVUsR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxFQUFFO0FBQ25DLFNBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQSxHQUFJLElBQUksQ0FBQzs7QUFFbEMsU0FBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2YsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIsU0FBRyxFQUFFLENBQUM7TUFDTixNQUFNLElBQUksS0FBSyxHQUFHLENBQUMsRUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBRTdCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0tBQ3RCLENBQUM7O0FBRUYsUUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxHQUFHLEVBQUU7QUFDckMsV0FBTSxLQUFLLE1BQU0sR0FBRyxHQUFHLENBQUEsQUFBQyxDQUFDOztBQUV6QixTQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUEsR0FBSSxJQUFJO1NBQ2hDLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxHQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxBQUFDLENBQUM7O0FBRTNDLFNBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDM0IsV0FBVyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUMvQixXQUFXLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQy9CLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUEsQUFBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUMvQyxDQUFDO0FBQ0gsU0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUN2QyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsRUFDbEMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQ2xDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUEsQUFBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUN4QyxDQUFDLENBQUM7QUFDSixTQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQ3JCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM5QixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDOUIsRUFBRSxDQUFDLENBQUMsQ0FDSCxDQUFDOztBQUVILFNBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtBQUNmLFlBQU0sR0FBRyxJQUFJLENBQUM7QUFDZCxpQkFBVyxHQUFHLElBQUksQ0FBQztBQUNuQixVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztNQUN0QjtLQUNELENBQUM7SUFDRixDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDZDs7O1FBN0ptQixtQkFBbUI7OztxQkFBbkIsbUJBQW1COzs7Ozs7Ozs7cUJDSnpCOztBQUVkLFFBQUksRUFBRSxnQkFBVztBQUNoQixlQUFPLENBQUMsQ0FBQztLQUNUO0FBQ0UsVUFBTSxFQUFFLGdCQUFVLENBQUMsRUFBRTtBQUNqQixlQUFPLENBQUMsQ0FBQztLQUNaO0FBQ0QsVUFBTSxFQUFFLGdCQUFVLENBQUMsRUFBRTtBQUNqQixlQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEI7QUFDRCxXQUFPLEVBQUUsaUJBQVUsQ0FBQyxFQUFFO0FBQ2xCLGVBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7S0FDdkI7QUFDRCxhQUFTLEVBQUUsbUJBQVUsQ0FBQyxFQUFFO0FBQ3BCLGVBQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0tBQ3pEO0FBQ0QsV0FBTyxFQUFFLGlCQUFVLENBQUMsRUFBRTtBQUNsQixlQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0FBQ0QsWUFBUSxFQUFFLGtCQUFVLENBQUMsRUFBRTtBQUNuQixlQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakM7QUFDRCxjQUFVLEVBQUUsb0JBQVUsQ0FBQyxFQUFFO0FBQ3JCLGVBQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7S0FDeEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJELFVBQU0sRUFBRSxnQkFBVSxDQUFDLEVBQUU7QUFDakIsZUFBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUN4QztBQUNELFdBQU8sRUFBRSxpQkFBVSxDQUFDLEVBQUU7QUFDbEIsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3BDO0FBQ0QsYUFBUyxFQUFFLG1CQUFVLENBQUMsRUFBRTtBQUNwQixlQUFPLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0tBQzdDO0FBQ0QsY0FBVSxFQUFFLG9CQUFVLENBQUMsRUFBRTtBQUNyQixlQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNoQztBQUNELGVBQVcsRUFBRSxxQkFBVSxDQUFDLEVBQUU7QUFDdEIsZUFBTyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1QztBQUNELGlCQUFhLEVBQUUsdUJBQVUsQ0FBQyxFQUFFO0FBQ3hCLGVBQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7S0FDbkY7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JDbEVzQixhQUFhOzs7OzZCQUNaLGtCQUFrQjs7OzsyQkFFakIsbUJBQW1COztJQUV0QyxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztBQUVWLFdBRk4sZ0JBQWdCLENBRVQsR0FBRyxFQUNmOzBCQUhLLGdCQUFnQjs7QUFJcEIsK0JBSkksZ0JBQWdCLDZDQUlkLEdBQUcsRUFBRTs7QUFFWCxRQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsWUFBWTtBQUM3QixVQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7VUFDM0IsY0FBYyxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7VUFDekQsYUFBYSxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7VUFDeEQsY0FBYyxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFM0Qsb0JBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLG9CQUFjLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RELG9CQUFjLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxzQkFBc0IsQ0FBQyxDQUFDOztBQUUxRCxtQkFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUNyRCxtQkFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQzs7QUFFekQsb0JBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDdEQsb0JBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLHNCQUFzQixDQUFDLENBQUM7O0FBRTFELGFBQU87QUFDTixzQkFBYyxFQUFFLGNBQWM7QUFDOUIsbUJBQVcsRUFBRSxhQUFhO0FBQzFCLG9CQUFZLEVBQUUsY0FBYztPQUM1QixDQUFDO0tBQ0YsQ0FBQSxFQUFHLENBQUM7O0FBRUwsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDOztBQUVsQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsb0ZBQW9GLENBQUM7O0FBRWpILFFBQUksQ0FBQyxRQUFRLEdBQUcsK0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLE9BQU8sR0FBRywrQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFDcEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQUFBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBSSxxQkFBcUIsQ0FBQzs7QUFFNUQsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN0Qzs7ZUFoREksZ0JBQWdCOztXQWtEVixxQkFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFDbEM7QUFDQyxVQUFJLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLEVBQUUsRUFDaEM7QUFDQyxZQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztBQUNuQyxZQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDOztBQUU3QixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7T0FDekI7O0FBRUQsVUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxvQkFBb0IsR0FBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQUFBQyxDQUFDO0FBQ3hFLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQzs7QUFFbEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFM0UsVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQzs7QUFFOUIsVUFBSSxPQUFPLEVBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FDakQsSUFBSSxPQUFPLENBQUMsRUFBRSx5QkFBWSxFQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxLQUV0RCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztLQUN4RDs7O1dBRTBCLHVDQUMzQjtBQUNDLFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFN0YsVUFBSSxDQUFDO1VBQ0osTUFBTSxHQUFHLEdBQUc7VUFDWixNQUFNLEdBQUcsR0FBRztVQUNaLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRTlCLGFBQU8sQ0FBQyxFQUFFLEVBQ1Y7QUFDQyxjQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELGNBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDdEQ7O0FBRUQsT0FBQyxHQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxBQUFDLENBQUM7O0FBRWpELGFBQU8sQ0FBQyxFQUFFLEVBQ1Y7QUFDQyxZQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQzFCO0FBQ0MsY0FBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNoRSxjQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDeEQsY0FBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNoRTtPQUNEO0tBQ0Q7OztXQUVtQixnQ0FDcEI7QUFDQyxVQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVoQixVQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxBQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFJLG9CQUFvQixDQUFDO0FBQ3ZELFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztBQUMzQixVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztBQUM3QyxVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDL0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7O0FBRWxDLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFdkQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsOERBQThELEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hILFVBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLDhEQUE4RCxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFbEgsVUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMvQixVQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLEVBQ3pCLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDOztBQUV4QixXQUFLLEdBQUcsSUFBSSxDQUFDOztBQUViLFVBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDbkI7OztXQUVjLDJCQUNmO0FBQ0MsVUFBSSxDQUFDO1VBQ0osS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUV2QixVQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDOztBQUU5QixVQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLEVBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFNUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7O0FBR2hCLFVBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUM3QixVQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHOUMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNyQixVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVyQixVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDL0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsb0JBQW9CLENBQUM7OztBQUdyRCxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDL0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7OztBQUd6RCxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDN0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFbEYsVUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFbkIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNyQixVQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEUsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7O0FBR2hCLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQzNDLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQSxHQUFJLElBQUksQ0FBQyxDQUFDLEVBQ3ZELENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQSxHQUFJLElBQUksQ0FBQyxDQUFDLENBQ3RELENBQUM7QUFDSCxjQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNwQyxjQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN2QyxjQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN0QyxjQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN2QyxjQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQzlCLFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdkMsY0FBUSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDdkgsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7O0FBRWxDLE9BQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0IsYUFBTyxDQUFDLEdBQUcsS0FBSyxFQUNoQjtBQUNDLFlBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsWUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsWUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUN0RCxZQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLFNBQUMsSUFBSSxJQUFJLENBQUM7T0FDVjs7QUFFRCxPQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFDdkMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQSxHQUFJLENBQUMsRUFDMUYsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ2QsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFDNUUsQ0FBQyxDQUNBLENBQUM7O0FBRUgsVUFBSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxFQUNoQztBQUNDLFlBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztBQUNoRCxZQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7QUFDOUMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUzRCxZQUFJLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDO09BQ2pDOztBQUVELFVBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUNqQyxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7O0FBR2xDLFVBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFVBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELFVBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7OztBQUdsQixVQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUzRSxVQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVuQixXQUFLLEdBQUcsSUFBSSxDQUFDO0tBQ2I7OztXQUVtQixnQ0FDcEI7QUFDQyxVQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVoQixVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztBQUMxQyxVQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDOztBQUUzRCxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsQ0FBQztBQUNsRyxVQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDOztBQUUzRCxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDN0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzs7QUFFNUQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7O0FBRTVELFVBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDbkI7OztXQUVHLGNBQUMsSUFBSSxFQUNUO0FBQ0MsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFekMs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QUFDLENBQUM7SUFDeEc7O0FBRUQsV0FBUSxHQUFHLElBQUksQ0FBQztBQUNoQixPQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ1osY0FBVyxHQUFHLElBQUksQ0FBQztBQUNuQixXQUFRLEdBQUcsSUFBSSxDQUFDO0dBQ2hCOzs7U0FFSSxlQUFDLEdBQUcsRUFBRTtBQUNWLE9BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzs7O0FBRXRDLFFBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQztPQUNyRCxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDakUsT0FBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzdDLE9BQUksT0FBTyxHQUFHLFNBQVMsSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sRUFBRTtBQUNsRCxXQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ2pCLFdBQU8sSUFBSSxVQUFVLENBQUM7SUFDdEI7QUFDRCxNQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLElBQUMsRUFBRSxDQUFDO0FBQ0osVUFBTyxJQUFJLENBQUMsQ0FBQztHQUNiOzs7UUEvRm1CLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBUSFJFRSAqL1xyXG5cclxuaW1wb3J0IFRyaWFsIGZyb20gJy4uLy4uL3NyYy9UcmlhbC5qcyc7XHJcbmltcG9ydCBDb3VydHJvb20gZnJvbSAnLi4vLi4vc3JjL0NvdXJ0cm9vbS5qcyc7XHJcbmltcG9ydCBBbmltYXRpb24gZnJvbSAnLi4vLi4vc3JjL0FuaW1hdGlvbi5qcyc7XHJcblxyXG5pbXBvcnQgQ29vcmRlbmFkYSBmcm9tICcuLi8uLi9zcmMvQ29vcmRlbmFkYS5qcyc7XHJcblxyXG5pbXBvcnQgU2NlbmVSZW5kZXJlciBmcm9tICcuLi8uLi9zcmMvU2NlbmVSZW5kZXJlci5qcyc7XHJcbmltcG9ydCBIdWRSZW5kZXJlciBmcm9tICcuLi8uLi9zcmMvSHVkUmVuZGVyZXIuanMnO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyXG5cdGxldCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLFxyXG5cdFx0aGVpZ2h0ID0gTWF0aC5mbG9vcig5IC8gMTYgKiB3aWR0aCk7XHJcblxyXG5cdGlmIChoZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuXHRcdGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHRcdHdpZHRoID0gTWF0aC5mbG9vcigxNiAvIDkgKiBoZWlnaHQpO1xyXG5cdH1cclxuXHJcblx0bGV0IGp1aWNpbyA9IG5ldyBUcmlhbCh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcblx0bGV0IHNjZW5lID0gbmV3IFNjZW5lUmVuZGVyZXIod2lkdGgsIGhlaWdodCk7XHJcblx0c2NlbmUuY3JlYXRlQ2FtZXJhKCk7XHJcblx0c2NlbmUuYWRkRWxlbWVudChuZXcgQ291cnRyb29tKTtcclxuXHRqdWljaW8uc2V0dXBSZW5kZXJlcignc2NlbmUnLCBzY2VuZSlcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuYXBwZW5kQ2hpbGQoc2NlbmUuY2FudmFzKTtcclxuXHJcblx0bGV0IGh1ZCA9IG5ldyBIdWRSZW5kZXJlcih3aWR0aCwgaGVpZ2h0KTtcclxuXHRqdWljaW8uc2V0dXBSZW5kZXJlcignaHVkJywgaHVkKTtcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuYXBwZW5kQ2hpbGQoaHVkLmNhbnZhcyk7XHJcblxyXG5cdFtcclxuXHRcdHsgaWQ6IFwibWFrb3RvXCIsXHRcdG5hbWU6IFwiTWFrb3RvIE5hZWdpXCIgfSxcclxuXHRcdHsgaWQ6IFwiaGlmdW1pXCIsXHRcdG5hbWU6IFwiSGlmdW1pIFlhbWFkYVwiIH0sXHJcblx0XHR7IGlkOiBcInRvdWtvXCIsXHRcdG5hbWU6IFwiVG91a28gRnVrYXdhXCIgfSxcclxuXHRcdHsgaWQ6IFwibGVvblwiLFx0XHRuYW1lOiBcIkxlb24gS3V3YXRhXCIgfSxcclxuXHRcdHsgaWQ6IFwiY2VsZXNcIixcdFx0bmFtZTogXCJDZWxlc3RpYSBMdWRlbmJlcmdcIiB9LFxyXG5cdFx0eyBpZDogXCJieWFrdXlhXCIsXHRuYW1lOiBcIkJ5YWt1eWEgVG9nYW1pXCIgfSxcclxuXHRcdHsgaWQ6IFwiY2hpaGlyb1wiLFx0bmFtZTogXCJDaGloaXJvIEZ1amlzYWtpXCIgfSxcclxuXHRcdHsgaWQ6IFwieWFzdWhpcm9cIixcdG5hbWU6IFwiWWFzdWhpcm8gSGFnYWt1cmVcIn0sXHJcblx0XHRudWxsLFxyXG5cdFx0eyBpZDogXCJhb2lcIixcdFx0bmFtZTogXCJBb2kgQXNhaGluYVwiIH0sXHJcblx0XHR7IGlkOiBcIm1vbmRvXCIsXHRcdG5hbWU6IFwiTW9uZG8gT293YWRhXCIgfSxcclxuXHRcdHsgaWQ6IFwia3lvdWtvXCIsXHRcdG5hbWU6IFwiS3lvdWtvIEtpcmlnaXJpXCIgfSxcclxuXHRcdHsgaWQ6IFwic2FrdXJhXCIsXHRcdG5hbWU6IFwiU2FrdXJhIE9vZ2FtaVwiIH0sXHJcblx0XHR7IGlkOiBcImp1bmtvXCIsXHRcdG5hbWU6IFwiSnVua28gRW5vc2hpbWFcIiB9LFxyXG5cdFx0eyBpZDogXCJraXlvdGFrYVwiLFx0bmFtZTogXCJLaXlvdGFrYSBJc2hpbWFydVwiIH0sXHJcblx0XHR7IGlkOiBcInNheWFrYVwiLFx0XHRuYW1lOiBcIlNheWFrYSBNYWl6b25vXCIgfVxyXG5cdF0uZm9yRWFjaChqdWljaW8uc2V0Q2hhcmFjdGVyLCBqdWljaW8pO1xyXG5cclxuXHRqdWljaW8ucHV0VGhlRnVja2luZ0JlYXIoKTtcclxuXHRqdWljaW8uc2V0TmFycmF0b3IoJ05hcnJhdG9yJyk7XHJcblxyXG5cdGp1aWNpby5jaGFuZ2VTdGFnZSgnZGlzY3Vzc2lvbicpO1xyXG5cclxuXHRqdWljaW8uc3RhZ2Uuc2NyZWVuLnNldERpYWxvZ3VlKGp1aWNpby5jaGFyYWN0ZXJzLm1ha290bywgJ1RoaXMgaXMgYSB2ZXJ5IGVhcmx5IHByZXZpZXcgdGVzdCBmb3IgdGhlIGRhbmdhbi1lbmdpbmUgcHJvamVjdC4gUHJlc3MgdGhlIGJ1dHRvbiBpbiB0aGUgY29ybmVyIHRvIHN0YXJ0LicsIHRydWUpO1xyXG5cclxuXHRqdWljaW8uc3RhZ2UuanVzdEtlZXBSZW5kZXJpbmcoKTtcclxuXHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvdG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRqdWljaW8ubG9hZFNjcmlwdChcImRlbW9fMDAxX2Rpc2N1c3Npb24uanNvblwiKTtcclxuXHR9LCBmYWxzZSk7XHJcbn0sIGZhbHNlKTtcclxuIiwiaW1wb3J0IENvb3JkZW5hZGEgZnJvbSAnLi9Db29yZGVuYWRhLmpzJztcclxuaW1wb3J0IFZpZGVvZ3JhcGhlciBmcm9tICcuL1ZpZGVvZ3JhcGhlci5qcyc7XHJcblxyXG5jbGFzcyBBbmltYXRpb25cclxue1xyXG5cdGNvbnN0cnVjdG9yKHJlbmRlcmVycylcclxuXHR7XHJcblx0XHR0aGlzLnNjZW5lID0gcmVuZGVyZXJzLnNjZW5lO1xyXG5cdFx0dGhpcy5odWQgPSByZW5kZXJlcnMuaHVkO1xyXG5cdH1cclxuXHJcblx0Y3V0VG8ocGFyYW0pXHJcblx0e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChlbmQpIHtcclxuXHRcdFx0dGhpcy5wcm9jZXNzb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoJ2ZvdicgaW4gcGFyYW0pIHtcclxuXHRcdFx0XHRcdHRoaXMubWFpbkNhbWVyYS5mb3YgPSBwYXJhbS5mb3Y7XHJcblx0XHRcdFx0XHR0aGlzLm1haW5DYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCdwb3NpdGlvbicgaW4gcGFyYW0pXHJcblx0XHRcdFx0XHR0aGlzLm1haW5DYW1lcmEucG9zaXRpb24uY29weShDb29yZGVuYWRhLnBhcnNlKHBhcmFtLnBvc2l0aW9uKSk7XHJcblxyXG5cdFx0XHRcdGlmICgndXAnIGluIHBhcmFtKVxyXG5cdFx0XHRcdFx0dGhpcy5tYWluQ2FtZXJhLnVwLmNvcHkoQ29vcmRlbmFkYS5wYXJzZShwYXJhbS51cCkpO1xyXG5cclxuXHRcdFx0XHRpZiAoJ2RpcmVjdGlvbicgaW4gcGFyYW0pXHJcblx0XHRcdFx0XHR0aGlzLm1haW5DYW1lcmEubG9va0F0KENvb3JkZW5hZGEucGFyc2UocGFyYW0uZGlyZWN0aW9uKSk7XHJcblxyXG5cdFx0XHRcdHRoaXMucHJvY2Vzc29yID0gbnVsbDtcclxuXHRcdFx0XHRwYXJhbSA9IG51bGw7XHJcblx0XHRcdFx0ZW5kKCk7XHJcblx0XHRcdH07XHJcblx0XHR9LmJpbmQodGhpcy5zY2VuZSkpO1xyXG5cdH1cclxuXHJcblx0dHJhbnNpY2lvbihwYXJhbSlcclxuXHR7XHJcblx0XHRpZiAoJ3ByZXNldCcgaW4gcGFyYW0pXHJcblx0XHRcdHJldHVybiB0aGlzW3BhcmFtLnByZXNldF0ocGFyYW0pO1xyXG5cclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoZW5kKSB7XHJcblx0XHRcdHZhciBicCA9IG5ldyBWaWRlb2dyYXBoZXIocGFyYW0uZHVyYXRpb24gfHwgNjAwMCwgcGFyYW0ucGF0aCwgcGFyYW0uZWFzaW5nKTtcclxuXHJcblx0XHRcdGlmICgnZm92JyBpbiBwYXJhbSlcclxuXHRcdFx0XHRicC5zZXR1cEZPVihcclxuXHRcdFx0XHRcdHBhcmFtLmZvdi5zdGFydCB8fCB0aGlzLm1haW5DYW1lcmEuZm92LFxyXG5cdFx0XHRcdFx0cGFyYW0uZm92LmVuZCB8fCBwYXJhbS5mb3YsXHJcblx0XHRcdFx0XHRwYXJhbS5mb3ZcclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0aWYgKCdwb3NpdGlvbicgaW4gcGFyYW0pXHJcblx0XHRcdFx0YnAuc2V0dXBQb3NpdGlvbihcclxuXHRcdFx0XHRcdHBhcmFtLnBvc2l0aW9uLnN0YXJ0IHx8IHRoaXMubWFpbkNhbWVyYS5wb3NpdGlvbixcclxuXHRcdFx0XHRcdHBhcmFtLnBvc2l0aW9uLmVuZCB8fCBwYXJhbS5wb3NpdGlvbixcclxuXHRcdFx0XHRcdHBhcmFtLnBvc2l0aW9uXHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdGlmICgndXAnIGluIHBhcmFtKVxyXG5cdFx0XHRcdGJwLnNldHVwVXAoXHJcblx0XHRcdFx0XHRwYXJhbS51cC5zdGFydCB8fCB0aGlzLm1haW5DYW1lcmEudXAsXHJcblx0XHRcdFx0XHRwYXJhbS51cC5lbmQgfHwgcGFyYW0udXAsXHJcblx0XHRcdFx0XHRwYXJhbS51cFxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAoJ2RpcmVjdGlvbicgaW4gcGFyYW0pXHJcblx0XHRcdFx0YnAuc2V0dXBEaXJlY3Rpb24oXHJcblx0XHRcdFx0XHRwYXJhbS5kaXJlY3Rpb24uc3RhcnQgfHwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEwKS5hcHBseU1hdHJpeDQodGhpcy5tYWluQ2FtZXJhLm1hdHJpeFdvcmxkKSxcclxuXHRcdFx0XHRcdHBhcmFtLmRpcmVjdGlvbi5lbmQgfHwgcGFyYW0uZGlyZWN0aW9uLFxyXG5cdFx0XHRcdFx0cGFyYW0uZGlyZWN0aW9uXHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdHBhcmFtID0gbnVsbDtcclxuXHJcblx0XHRcdHRoaXMucHJvY2Vzc29yID0gZnVuY3Rpb24gKG5vdykge1xyXG5cdFx0XHRcdGNvbnN0IGF2YW5jZSA9IGJwLmRlbHRhKG5vdyk7XHJcblxyXG5cdFx0XHRcdGJwLnJ1blN0YWdlKHRoaXMubWFpbkNhbWVyYSwgYXZhbmNlKTtcclxuXHJcblx0XHRcdFx0aWYgKGF2YW5jZSA+IDEpIHtcclxuXHRcdFx0XHRcdHRoaXMucHJvY2Vzc29yID0gbnVsbDtcclxuXHRcdFx0XHRcdGJwID0gbnVsbDtcclxuXHJcblx0XHRcdFx0XHRlbmQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9LmJpbmQodGhpcy5zY2VuZSkpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0aW9uIiwiY2xhc3MgQ2hhcmFjdGVyXHJcbntcclxuXHRjb25zdHJ1Y3RvcihjaGFyYWN0ZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5pZCA9IGNoYXJhY3Rlci5pZDtcclxuXHRcdHRoaXMubmFtZSA9IGNoYXJhY3Rlci5uYW1lO1xyXG5cclxuXHRcdHRoaXMudGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKG5ldyBJbWFnZSk7XHJcblx0XHR0aGlzLnRleHR1cmUuaW1hZ2Uub25sb2FkID0gSW1hZ2VMb2FkSGFuZGxlci5iaW5kKHRoaXMudGV4dHVyZSk7XHJcblxyXG5cdFx0KGNoYXJhY3Rlci5pZCAhPSBDaGFyYWN0ZXIuTkFSUkFUT1IpICYmIHRoaXMuY2hhbmdlU3ByaXRlKCdzcHJpdGUnIGluIGNoYXJhY3RlciA/IGNoYXJhY3Rlci5zcHJpdGUgOiAxKTtcclxuXHR9XHJcblxyXG5cdGdldCBmdWxsYm9keVNwcml0ZVVyaSgpXHJcblx0e1xyXG5cdFx0cmV0dXJuIENoYXJhY3Rlci5SRVNPVVJDRVNfUEFUSCArIENoYXJhY3Rlci5GVUxMQk9EWV9QQVRIICsgdGhpcy5pZCArICcvJyArIHRoaXMuc3ByaXRlICsgJy5wbmcnXHJcblx0fVxyXG5cclxuXHRnZXQgYnVzdFNwcml0ZVVyaSgpXHJcblx0e1xyXG5cdFx0cmV0dXJuIENoYXJhY3Rlci5SRVNPVVJDRVNfUEFUSCArIENoYXJhY3Rlci5CVVNUX1BBVEggKyB0aGlzLmlkICsgJy5wbmcnO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlU3ByaXRlKHNwcml0ZSlcclxuXHR7XHJcblx0XHR0aGlzLnNwcml0ZSA9IHNwcml0ZTtcclxuXHRcdHRoaXMudGV4dHVyZS5pbWFnZS5zcmMgPSB0aGlzLmZ1bGxib2R5U3ByaXRlVXJpO1xyXG5cdH1cclxufVxyXG5cclxuQ2hhcmFjdGVyLlJFU09VUkNFU19QQVRIID0gJy9yZXNvdXJjZXMvJztcclxuQ2hhcmFjdGVyLkZVTExCT0RZX1BBVEggPSAnc3ByaXRlcy8nO1xyXG5DaGFyYWN0ZXIuQlVTVF9QQVRIID0gJ2J1c3RzLyc7XHJcblxyXG5DaGFyYWN0ZXIuTkFSUkFUT1IgPSAnbmFycmF0b3InO1xyXG5cclxuZnVuY3Rpb24gSW1hZ2VMb2FkSGFuZGxlcigpIHtcclxuXHR2YXIgaSwgaW1nX2RhdGEsXHJcblx0XHRpbWdfdyA9IE1hdGguZmxvb3IodGhpcy5pbWFnZS5uYXR1cmFsV2lkdGggLyAzKSxcclxuXHRcdGltZ19oID0gdGhpcy5pbWFnZS5uYXR1cmFsSGVpZ2h0LFxyXG5cdFx0Y3R4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcblx0Y3R4LmNhbnZhcy53aWR0aCA9IGltZ193O1xyXG5cdGN0eC5jYW52YXMuaGVpZ2h0ID0gaW1nX2g7XHJcblxyXG5cdGN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSxcclxuXHRcdGltZ193LCAwLCBpbWdfdywgaW1nX2gsXHJcblx0XHRpbWdfdywgMCwgaW1nX3csIGltZ19oKTtcclxuXHJcblx0aW1nX2RhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKGltZ193LCAwLCBpbWdfdywgaW1nX2gpO1xyXG5cclxuXHRmb3IoaSA9IDA7IGkgPCBpbWdfZGF0YS5kYXRhLmxlbmd0aDsgaSArPSA0KVxyXG5cdHtcclxuXHRcdGlmIChpbWdfZGF0YS5kYXRhW2ldICE9IDApXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuaGVhZExldmVsID0gKGltZ19oIC0gTWF0aC5mbG9vcihpIC8gaW1nX3cpKSAqIDYgLyA3O1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGltZ19kYXRhID0gbnVsbDtcclxuXHRjdHggPSBudWxsO1xyXG5cclxuXHR0aGlzLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyIiwiY2xhc3MgQ2hhcmFjdGVyQ2FyZCBleHRlbmRzIFRIUkVFLk9iamVjdDNEXHJcbntcclxuXHRjb25zdHJ1Y3RvcihjaGFyYWN0ZXIpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLmNvdW50ZXIgPSAtMTtcclxuXHJcblx0XHR0aGlzLmZyb250ID0gbmV3IFRIUkVFLk1lc2goXHJcblx0XHRcdENoYXJhY3RlckNhcmQuZ2VvbWV0cnksXHJcblx0XHRcdG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XHJcblx0XHRcdFx0XHRtYXA6IGNoYXJhY3Rlci50ZXh0dXJlLFxyXG5cdFx0XHRcdFx0dHJhbnNwYXJlbnQ6IHRydWUsXHJcblx0XHRcdFx0XHRjb2xvcjogMHhGRkZGRkYsXHJcblx0XHRcdFx0XHRzaWRlOiBUSFJFRS5Gcm9udFNpZGVcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpO1xyXG5cdFx0dGhpcy5mcm9udC5wb3NpdGlvbi54ID0gMC4wMjtcclxuXHJcblx0XHR0aGlzLmJhY2sgPSBuZXcgVEhSRUUuTWVzaChcclxuXHRcdFx0XHRDaGFyYWN0ZXJDYXJkLmdlb21ldHJ5LFxyXG5cdFx0XHRcdG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XHJcblx0XHRcdFx0XHRtYXA6IGNoYXJhY3Rlci50ZXh0dXJlLFxyXG5cdFx0XHRcdFx0dHJhbnNwYXJlbnQ6IHRydWUsXHJcblx0XHRcdFx0XHRjb2xvcjogMHgwMDAwMDAsXHJcblx0XHRcdFx0XHRzaWRlOiBUSFJFRS5CYWNrU2lkZVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdCk7XHJcblx0XHR0aGlzLmJhY2sucG9zaXRpb24ueCA9IC0wLjAyO1xyXG5cclxuXHRcdHRoaXMuYWRkKHRoaXMuZnJvbnQsIHRoaXMuYmFjayk7XHJcblxyXG5cdFx0Y2hhcmFjdGVyLmNhcmQgPSB0aGlzO1xyXG5cdH1cclxufVxyXG5cclxuQ2hhcmFjdGVyQ2FyZC5nZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KDEwLCAyMCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJDYXJkIiwiY2xhc3MgQ29vcmRlbmFkYVxyXG57XHJcblx0Y29uc3RydWN0b3IoeCwgeSwgeilcclxuXHR7XHJcblx0XHR0aGlzLnggPSB4IHx8IDA7XHJcblx0XHR0aGlzLnkgPSB5IHx8IDA7XHJcblx0XHR0aGlzLnogPSB6IHx8IDA7XHJcblx0fVxyXG5cclxuXHRnZXQgcigpXHJcblx0e1xyXG5cdFx0cmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyAodGhpcy5zcGhlcmljYWwgPyB0aGlzLnogKiB0aGlzLnogOiAwKSk7XHJcblx0fVxyXG5cdHNldCByKHIpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuc3BoZXJpY2FsKVxyXG5cdFx0XHR0aGlzLnNldFNwaGVyaWNhbChyLCB0aGlzLnQsIHRoaXMucCk7XHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMuc2V0UG9sYXIociwgdGhpcy5wKTtcclxuXHR9XHJcblxyXG5cdGdldCB0KClcclxuXHR7XHJcblx0XHRyZXR1cm4gTWF0aC5hY29zKHRoaXMueiAvIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnopKTtcclxuXHR9XHJcblx0c2V0IHQodClcclxuXHR7XHJcblx0XHR0aGlzLnNldFNwaGVyaWNhbCh0aGlzLnIsIHQsIHRoaXMucCk7XHJcblx0fVxyXG5cclxuXHRnZXQgcCgpXHJcblx0e1xyXG5cdFx0cmV0dXJuIE1hdGguYXRhbjIodGhpcy55LCB0aGlzLngpO1xyXG5cdH1cclxuXHRzZXQgcChwKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLnNwaGVyaWNhbClcclxuXHRcdFx0dGhpcy5zZXRTcGhlcmljYWwodGhpcy5yLCB0aGlzLnQsIHApO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLnNldFBvbGFyKHRoaXMuciwgcCk7XHJcblx0fVxyXG5cclxuXHRnZXQgdmVjdG9yMygpXHJcblx0e1xyXG5cdFx0cmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG5cdH1cclxuXHJcblx0dG9TdHJpbmcoKVxyXG5cdHtcclxuXHRcdHJldHVybiBcInt4OlwiICsgdGhpcy54ICsgXCIsIHk6XCIgKyB0aGlzLnkgKyBcIiwgejogXCIgKyB0aGlzLnogKyBcIn1cIjtcclxuXHR9XHJcblxyXG5cdHNldFNwaGVyaWNhbChyLCB0LCBwKVxyXG5cdHtcclxuXHRcdC8vIHQ6IGluY2xpbmFjacOzbiwgMMKwLTE4MMKwXHJcblx0XHQvLyBwOiBhemltdXRoLCAwwrAtMzYwwrBcclxuXHJcblx0XHR0aGlzLnggPSByICogTWF0aC5zaW4odCkgKiBNYXRoLmNvcyhwKTtcclxuXHRcdHRoaXMueSA9IHIgKiBNYXRoLnNpbih0KSAqIE1hdGguc2luKHApO1xyXG5cdFx0dGhpcy56ID0gciAqIE1hdGguY29zKHQpO1xyXG5cdH1cclxuXHJcblx0c2V0UG9sYXIociwgcCwgeilcclxuXHR7XHJcblx0XHR0aGlzLnggPSByICogTWF0aC5jb3MocCk7XHJcblx0XHR0aGlzLnkgPSByICogTWF0aC5zaW4ocCk7XHJcblx0XHR0aGlzLnogPSBpc0Zpbml0ZSh6KSA/IHogOiB0aGlzLno7XHJcblx0fVxyXG59XHJcblxyXG5Db29yZGVuYWRhLnBhcnNlID0gZnVuY3Rpb24gKGlucHV0KVxyXG57XHJcblx0aWYgKGlucHV0IGluc3RhbmNlb2YgdGhpcylcclxuXHRcdHJldHVybiBpbnB1dDtcclxuXHJcblx0ZWxzZSBpZiAoaW5wdXQuaGFzT3duUHJvcGVydHkoJ3gnKSlcclxuXHRcdHJldHVybiBuZXcgdGhpcyhpbnB1dC54LCBpbnB1dC55LCBpbnB1dC56KTtcclxuXHJcblx0ZWxzZSBpZiAoaW5wdXQuaGFzT3duUHJvcGVydHkoJ3QnKSkge1xyXG5cdFx0bGV0IHBvaW50ID0gbmV3IHRoaXMoKTtcclxuXHRcdHBvaW50LnNwaGVyaWNhbCA9IHRydWU7XHJcblx0XHRwb2ludC5zZXRTcGhlcmljYWwoaW5wdXQuciwgaW5wdXQudCwgaW5wdXQucCk7XHJcblx0XHRyZXR1cm4gcG9pbnQ7XHJcblx0fVxyXG5cclxuXHRlbHNlIGlmIChpbnB1dC5oYXNPd25Qcm9wZXJ0eSgncCcpKSB7XHJcblx0XHRsZXQgcG9pbnQgPSBuZXcgdGhpcygpO1xyXG5cdFx0cG9pbnQuc2V0UG9sYXIoaW5wdXQuciwgaW5wdXQucCwgaW5wdXQueik7XHJcblx0XHRyZXR1cm4gcG9pbnQ7XHJcblx0fVxyXG5cclxuXHRlbHNlIGlmIChBcnJheS5pc0FycmF5KGlucHV0KSlcclxuXHRcdHJldHVybiBuZXcgdGhpcyhpbnB1dFswXSwgaW5wdXRbMV0sIGlucHV0WzJdKTtcclxuXHJcblx0ZWxzZVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ29vcmRlbmFkYS5wYXJzZTogQ291bGRuJ3QgcGFyc2UgaW5wdXQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb29yZGVuYWRhIiwiaW1wb3J0IEN5bGluZGVyQnVmZmVyR2VvbWV0cnkgZnJvbSAnLi9DeWxpbmRlckJ1ZmZlckdlb21ldHJ5LmpzJztcclxuaW1wb3J0IFBsYXRmb3JtQnVmZmVyR2VvbWV0cnkgZnJvbSAnLi9QbGF0Zm9ybUJ1ZmZlckdlb21ldHJ5LmpzJztcclxuaW1wb3J0IFN0YW5kR2VvbWV0cnkgZnJvbSAnLi9TdGFuZEdlb21ldHJ5LmpzJztcclxuXHJcbnZhciBURVhUVVJFUztcclxuXHJcbmZ1bmN0aW9uIHRleHR1cmVMb2FkZXIoc3JjKSB7XHJcbiAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKG5ldyBJbWFnZSk7XHJcbiAgICB0ZXh0dXJlLmltYWdlLm9ubG9hZCA9IEltYWdlTG9hZEhhbmRsZXIuYmluZCh0ZXh0dXJlKTtcclxuICAgIHRleHR1cmUuaW1hZ2Uuc3JjID0gQ291cnRyb29tLlRFWFRVUkVfUkVMQVRJVkVfVVJJICsgc3JjO1xyXG4gICAgcmV0dXJuIHRleHR1cmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEltYWdlTG9hZEhhbmRsZXIoKSB7XHJcbiAgICB0aGlzLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxufVxyXG5cclxuY2xhc3MgQ291cnRyb29tIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Rcclxue1xyXG4gICAgY29uc3RydWN0b3IoYXBvdGhlbSwgaGVpZ2h0KVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgVEVYVFVSRVMgPSB7XHJcbiAgICAgICAgICAgIFdBTExQQVBFUjogdGV4dHVyZUxvYWRlcignY2hhcHRlcjEtd2FsbHBhcGVyLnBuZycpLFxyXG4gICAgICAgICAgICBCQVNFQk9BUkQ6IHRleHR1cmVMb2FkZXIoJ2NoYXB0ZXIxLWd1YXJkYXBvbHZvLnBuZycpLFxyXG4gICAgICAgICAgICBSRURDQVJQRVQ6IHRleHR1cmVMb2FkZXIoXCJhbGZvbWJyYVIucG5nXCIpLFxyXG4gICAgICAgICAgICBDVVJUQUlOOiB0ZXh0dXJlTG9hZGVyKFwiY2hhcHRlcjEtc2FsaWRhLnBuZ1wiKSxcclxuICAgICAgICAgICAgQ09MVU1OOiB0ZXh0dXJlTG9hZGVyKFwiY2hhcHRlcjEtbWFyY29zLnBuZ1wiKSxcclxuICAgICAgICAgICAgV09PRDogdGV4dHVyZUxvYWRlcihcIndvb2QuanBnXCIpLFxyXG4gICAgICAgICAgICBDTE9VRFM6IHRleHR1cmVMb2FkZXIoXCJjbG91ZHMuanBnXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgYXBvdGhlbSA9IGFwb3RoZW0gfHwgMTIwO1xyXG4gICAgICAgIGhlaWdodCA9IGhlaWdodCB8fCA4MDtcclxuXHJcbiAgICAgICAgdGhpcy5hZGQoXHJcbiAgICAgICAgICAgIC8vIFRJTEVEIEZMT09SXHJcbiAgICAgICAgICAgIC8vIHNpZGU6IDI0MFxyXG4gICAgICAgICAgICAvLyBzZWdtZW50czogMjJcclxuICAgICAgICAgICAgbmV3IEZsb29yKDIgKiBhcG90aGVtLCAyMiksXHJcblxyXG4gICAgICAgICAgICAvLyBXQUxMU1xyXG4gICAgICAgICAgICAvLyBhbW91bnQ6IDhcclxuICAgICAgICAgICAgLy8gaGVpZ2h0OiA4MFxyXG4gICAgICAgICAgICAvLyBhcG90aGVtOiAxMjBcclxuICAgICAgICAgICAgbmV3IFdhbGxzKDgsIGhlaWdodCwgYXBvdGhlbSksXHJcblxyXG4gICAgICAgICAgICAvLyBFWElUU1xyXG4gICAgICAgICAgICAvLyBhbW91bnQ6IDhcclxuICAgICAgICAgICAgLy8gYXBvdGhlbTogMTE5XHJcbiAgICAgICAgICAgIG5ldyBFeGl0cyg4LCBhcG90aGVtIC0gMSlcclxuICAgICAgICAgICAgICAgIC8vIENBUlBFVFNcclxuICAgICAgICAgICAgICAgIC8vIHdpZHRoOiA4XHJcbiAgICAgICAgICAgICAgICAvLyBsb25naXR1ZGU6IDEwMFxyXG4gICAgICAgICAgICAgICAgLnNldENhcnBldHMoMTAsIDEwMClcclxuICAgICAgICAgICAgICAgIC8vIENVUlRBSU5TXHJcbiAgICAgICAgICAgICAgICAvLyB3aWR0aDogMzZcclxuICAgICAgICAgICAgICAgIC5zZXRDdXJ0YWlucyg0OClcclxuICAgICAgICAgICAgICAgIC8vIFBJTExBUlNcclxuICAgICAgICAgICAgICAgIC8vIHJhZGl1czogNVxyXG4gICAgICAgICAgICAgICAgLy8gaGVpZ2h0OiA4MFxyXG4gICAgICAgICAgICAgICAgLnNldFBpbGxhcnMoMywgaGVpZ2h0KSxcclxuXHJcbiAgICAgICAgICAgIG5ldyBQbGF0Zm9ybSgpLFxyXG4gICAgICAgICAgICBuZXcgVHJpYWxTdGFuZHMoKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGbG9vciBleHRlbmRzIFRIUkVFLk1lc2hcclxue1xyXG4gICAgY29uc3RydWN0b3IoYW5jaG8sIHNlZ20pXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsLCBnZW9tZXRyeSxcclxuICAgICAgICAgICAgaSwgaiwgdG90YWw7XHJcblxyXG4gICAgICAgIGFuY2hvID0gYW5jaG8gfHwgMTIwO1xyXG4gICAgICAgIHNlZ20gPSBzZWdtIHx8IDE4O1xyXG5cclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoRmFjZU1hdGVyaWFsKFtcclxuICAgICAgICAgICAgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IDB4MDAwMDAwLFxyXG4gICAgICAgICAgICAgICAgcG9seWdvbk9mZnNldDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBvbHlnb25PZmZzZXRGYWN0b3I6IDEuMCxcclxuICAgICAgICAgICAgICAgIHBvbHlnb25PZmZzZXRVbml0czogNC4wXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogMHhGRkZGRkYsXHJcbiAgICAgICAgICAgICAgICBwb2x5Z29uT2Zmc2V0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcG9seWdvbk9mZnNldEZhY3RvcjogMS4wLFxyXG4gICAgICAgICAgICAgICAgcG9seWdvbk9mZnNldFVuaXRzOiA0LjBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeShhbmNobywgYW5jaG8sIHNlZ20sIHNlZ20pO1xyXG5cclxuICAgICAgICB0b3RhbCA9IGdlb21ldHJ5LmZhY2VzLmxlbmd0aCAvIDI7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcclxuICAgICAgICAgICAgaiA9IGkgKiAyO1xyXG4gICAgICAgICAgICBnZW9tZXRyeS5mYWNlc1tqXS5tYXRlcmlhbEluZGV4ID0gKChpICsgTWF0aC5mbG9vcihpIC8gc2VnbSkpICUgMik7XHJcbiAgICAgICAgICAgIGdlb21ldHJ5LmZhY2VzW2ogKyAxXS5tYXRlcmlhbEluZGV4ID0gKChpICsgTWF0aC5mbG9vcihpIC8gc2VnbSkpICUgMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdXBlcihnZW9tZXRyeSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucm90YXRpb24ueiA9IE1hdGguUEkgLyA4O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueiA9IC0wLjA1O1xyXG5cclxuICAgICAgICBtYXRlcmlhbCA9IGdlb21ldHJ5ID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgV2FsbHMgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihhbW91bnQsIGhlaWdodCwgYXBvdGhlbSlcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBtYXRlcmlhbCwgZ2VvbWV0cnk7XHJcblxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgICAgICAgICAgY29sb3I6IDB4MkQyODY3LFxyXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5CYWNrU2lkZSxcclxuICAgICAgICAgICAgbWFwOiBURVhUVVJFUy5XQUxMUEFQRVJcclxuICAgICAgICB9KTtcclxuICAgICAgICBnZW9tZXRyeSA9IG5ldyBDeWxpbmRlckJ1ZmZlckdlb21ldHJ5KGFtb3VudCwgaGVpZ2h0LCBhcG90aGVtKTtcclxuICAgICAgICB0aGlzLmFkZChuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpKTtcclxuXHJcbiAgICAgICAgVEVYVFVSRVMuQkFTRUJPQVJELndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XHJcbiAgICAgICAgVEVYVFVSRVMuQkFTRUJPQVJELnJlcGVhdC5zZXQoMiwgMSk7XHJcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xyXG4gICAgICAgICAgICBjb2xvcjogMHhBQUFBQUEsXHJcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkJhY2tTaWRlLFxyXG4gICAgICAgICAgICBtYXA6IFRFWFRVUkVTLkJBU0VCT0FSRFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGdlb21ldHJ5ID0gbmV3IEN5bGluZGVyQnVmZmVyR2VvbWV0cnkoYW1vdW50LCBoZWlnaHQgKiAwLjA0LCBhcG90aGVtIC0gMC4wNSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hZGQobmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEV4aXRzIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Rcclxue1xyXG4gICAgY29uc3RydWN0b3IoYW1vdW50LCBhcG90aGVtKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xyXG4gICAgICAgIHRoaXMuYXBvdGhlbSA9IGFwb3RoZW07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldEN1cnRhaW5zKHdpZHRoKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBpLCBhbmdsZSxcclxuICAgICAgICAgICAgZ2VvbWV0cnksIG1hdGVyaWFsLCBtZXNoO1xyXG5cclxuICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KHdpZHRoLCB3aWR0aCwgMSwgMSk7XHJcblxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgICAgICAgICAgY29sb3I6IDB4RUVFRUVFLFxyXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGUsXHJcbiAgICAgICAgICAgIG1hcDogVEVYVFVSRVMuQ1VSVEFJTixcclxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMC41OyBpIDwgdGhpcy5hbW91bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBhbmdsZSA9ICgyICogTWF0aC5QSSkgKiBpIC8gdGhpcy5hbW91bnQ7XHJcblxyXG4gICAgICAgICAgICBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIG1lc2gucm90YXRpb24ueCA9IE1hdGguUEkgLyAyO1xyXG4gICAgICAgICAgICBtZXNoLnJvdGF0aW9uLnkgPSAtYW5nbGU7XHJcblxyXG4gICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnggPSB0aGlzLmFwb3RoZW0gKiBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgICAgIG1lc2gucG9zaXRpb24ueSA9IHRoaXMuYXBvdGhlbSAqIE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICAgICAgbWVzaC5wb3NpdGlvbi56ID0gd2lkdGggLyAyIC0gMTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkKG1lc2gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF0ZXJpYWwgPSBudWxsO1xyXG4gICAgICAgIGdlb21ldHJ5ID0gbnVsbDtcclxuICAgICAgICBtZXNoID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldENhcnBldHMod2lkdGgsIGxvbmdpdHVkZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgaSwgYW5nbGUsXHJcbiAgICAgICAgICAgIGdlb21ldHJ5LCBtYXRlcmlhbCwgbWVzaDtcclxuXHJcbiAgICAgICAgVEVYVFVSRVMuUkVEQ0FSUEVULndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XHJcbiAgICAgICAgVEVYVFVSRVMuUkVEQ0FSUEVULnJlcGVhdC5zZXQoMSwgMyk7XHJcblxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xyXG4gICAgICAgICAgICBjb2xvcjogMHhGRkZGRkYsXHJcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkZyb250U2lkZSxcclxuICAgICAgICAgICAgbWFwOiBURVhUVVJFUy5SRURDQVJQRVRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSh3aWR0aCwgbG9uZ2l0dWRlLCAxLCAxKTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMC41OyBpIDwgdGhpcy5hbW91bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBhbmdsZSA9IGkgLyB0aGlzLmFtb3VudCAqIDIgKiBNYXRoLlBJO1xyXG5cclxuICAgICAgICAgICAgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBtZXNoLnJvdGF0aW9uLnogPSBhbmdsZTtcclxuXHJcbiAgICAgICAgICAgIG1lc2gucG9zaXRpb24ueCA9ICh0aGlzLmFwb3RoZW0gLSBsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKC1hbmdsZSk7XHJcbiAgICAgICAgICAgIG1lc2gucG9zaXRpb24ueSA9ICh0aGlzLmFwb3RoZW0gLSBsb25naXR1ZGUgLyAyKSAqIE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICAgICAgbWVzaC5wb3NpdGlvbi56ID0gMC4wNTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkKG1lc2gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF0ZXJpYWwgPSBudWxsO1xyXG4gICAgICAgIGdlb21ldHJ5ID0gbnVsbDtcclxuICAgICAgICBtZXNoID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UGlsbGFycyhyYWRpdXMsIGhlaWdodClcclxuICAgIHtcclxuICAgICAgICB2YXIgdGV4dHVyZSwgbWF0ZXJpYWwsIGdlb21ldHJ5LCBtZXNoLFxyXG4gICAgICAgICAgICBpLCBhbmdsZSwgZGV2aWF0aW9uO1xyXG5cclxuICAgICAgICB0ZXh0dXJlID0gVEVYVFVSRVMuQ09MVU1OO1xyXG4gICAgICAgIHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcclxuICAgICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoMSwgMik7XHJcblxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgICAgICAgICAgY29sb3I6IDB4RkZGRkZGLFxyXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGUsXHJcbiAgICAgICAgICAgIG1hcDogdGV4dHVyZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBnZW9tZXRyeSA9IG5ldyBDeWxpbmRlckJ1ZmZlckdlb21ldHJ5KDQsIGhlaWdodCwgcmFkaXVzKTtcclxuXHJcbiAgICAgICAgLy8gQ3VzdG9tIFVWIG1hcHBpbmcgZm9yIHRoZSBnYW1lIGV4dHJhY3RlZCB0ZXh0dXJlXHJcbiAgICAgICAgYW5nbGUgPSBbMCwgMC4xNzU3ODEyNSwgMC40NDUzMTI1LCAwLjczMDQ2ODc1LCAxXTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdlb21ldHJ5LmF0dHJpYnV0ZXMudXYuYXJyYXlbaSAqIDEyICsgIDBdID0gYW5nbGVbaSsxXTtcclxuICAgICAgICAgICAgZ2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVtpICogMTIgKyAgMV0gPSAxO1xyXG5cclxuICAgICAgICAgICAgZ2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVtpICogMTIgKyAgMl0gPSBhbmdsZVtpXTtcclxuICAgICAgICAgICAgZ2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVtpICogMTIgKyAgM10gPSAxO1xyXG5cclxuICAgICAgICAgICAgZ2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVtpICogMTIgKyAgNF0gPSBhbmdsZVtpXTtcclxuICAgICAgICAgICAgZ2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVtpICogMTIgKyAgNV0gPSAwO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGdlb21ldHJ5LmF0dHJpYnV0ZXMudXYuYXJyYXlbaSAqIDEyICsgIDZdID0gYW5nbGVbaV07XHJcbiAgICAgICAgICAgIGdlb21ldHJ5LmF0dHJpYnV0ZXMudXYuYXJyYXlbaSAqIDEyICsgIDddID0gMDtcclxuXHJcbiAgICAgICAgICAgIGdlb21ldHJ5LmF0dHJpYnV0ZXMudXYuYXJyYXlbaSAqIDEyICsgIDhdID0gYW5nbGVbaSsxXTtcclxuICAgICAgICAgICAgZ2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVtpICogMTIgKyAgOV0gPSAwO1xyXG5cclxuICAgICAgICAgICAgZ2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVtpICogMTIgKyAxMF0gPSBhbmdsZVtpKzFdO1xyXG4gICAgICAgICAgICBnZW9tZXRyeS5hdHRyaWJ1dGVzLnV2LmFycmF5W2kgKiAxMiArIDExXSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZXZpYXRpb24gPSBNYXRoLmF0YW4oMC40NiAqIE1hdGgudGFuKE1hdGguUEkgLyB0aGlzLmFtb3VudCkpO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5hbW91bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBhbmdsZSA9ICgyICogTWF0aC5QSSkgKiBpIC8gdGhpcy5hbW91bnQ7XHJcblxyXG5cclxuICAgICAgICAgICAgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBtZXNoLnJvdGF0aW9uLnogPSBNYXRoLlBJIC8gMiAtIGFuZ2xlO1xyXG5cclxuICAgICAgICAgICAgbWVzaC5wb3NpdGlvbi54ID0gdGhpcy5hcG90aGVtICogTWF0aC5zaW4oYW5nbGUgKyBkZXZpYXRpb24pO1xyXG4gICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnkgPSB0aGlzLmFwb3RoZW0gKiBNYXRoLmNvcyhhbmdsZSArIGRldmlhdGlvbik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZChtZXNoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIG1lc2gucm90YXRpb24ueiA9IE1hdGguUEkgLyAyIC0gYW5nbGU7XHJcblxyXG4gICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnggPSB0aGlzLmFwb3RoZW0gKiBNYXRoLnNpbihhbmdsZSAtIGRldmlhdGlvbik7XHJcbiAgICAgICAgICAgIG1lc2gucG9zaXRpb24ueSA9IHRoaXMuYXBvdGhlbSAqIE1hdGguY29zKGFuZ2xlIC0gZGV2aWF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkKG1lc2gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgbWF0ZXJpYWwgPSBudWxsO1xyXG4gICAgICAgIGdlb21ldHJ5ID0gbnVsbDtcclxuICAgICAgICBtZXNoID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFBsYXRmb3JtIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Rcclxue1xyXG4gICAgY29uc3RydWN0b3IoKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCwgZ2VvbWV0cnksIG1hbGxhO1xyXG5cclxuICAgICAgICAvLyAgQUxGT01CUkEgUkFESUFMXHJcbiAgICAgICAgLy8gIHJhZGlvSW50ID0gMTcuNSwgcmFkaW9FeHQgPSAyNi41LCBzZWdtZW50b3MgPSAzMlxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgICAgICAgICAgY29sb3I6IDB4RkZGRkZGLFxyXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGUsXHJcbiAgICAgICAgICAgIG1hcDogVEVYVFVSRVMuUkVEQ0FSUEVUXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdlb21ldHJ5ID0gbmV3IFBsYXRmb3JtQnVmZmVyR2VvbWV0cnkoMTcuNSwgMjcuNSwgMzIpO1xyXG5cclxuICAgICAgICBtYWxsYSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgbWFsbGEucG9zaXRpb24ueiA9IDE7XHJcbiAgICAgICAgdGhpcy5hZGQobWFsbGEpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gIFBMQVRBRk9STUE6IENJTElORFJPIEVYVEVSSU9SXHJcbiAgICAgICAgLy8gIHJhZGlvU3VwID0gMjguNSwgcmFkaW9JbmYgPSAyOC41LCBhbHR1cmEgPSAxLCBzZWdtUmFkaWFsZXMgPSAzMiwgc2VnbVZlcnRpY2FsZXMgPSAxLCBhYmllcnRvID0gdHJ1ZVxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgICAgICAgICAgY29sb3I6IDB4MDAwMDAwLFxyXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgyNy41LCAyNy41LCAxLCAzMiwgMSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIG1hbGxhID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgICAgICBtYWxsYS5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7XHJcbiAgICAgICAgbWFsbGEucm90YXRpb24ueSA9IDExLjI1ICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICBtYWxsYS5wb3NpdGlvbi56ID0gMC41O1xyXG4gICAgICAgIHRoaXMuYWRkKG1hbGxhKTtcclxuXHJcbiAgICAgICAgbWF0ZXJpYWwgPSBudWxsO1xyXG4gICAgICAgIGdlb21ldHJ5ID0gbnVsbDtcclxuICAgICAgICBtYWxsYSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFRyaWFsU3RhbmRzIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Rcclxue1xyXG4gICAgY29uc3RydWN0b3IoKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHZhciB0ZXh0dXJhLCBtYXRlcmlhbCwgZ2VvbWV0cnksIG1hbGxhLFxyXG4gICAgICAgICAgICBpLCBqLCBrO1xyXG5cclxuICAgICAgICB0ZXh0dXJhID0gVEVYVFVSRVMuV09PRDtcclxuXHJcbiAgICAgICAgLy8gIEJBU0VTIERFIE1BREVSQVxyXG4gICAgICAgIC8vICByYWRpb1N1cCA9IDE2LjUsIHJhZGlvSW5mID0gMTQuNSwgYWx0dXJhID0gMSwgc2VnbVJhZGlhbGVzID0gMTYsIHNlZ21WZXJ0aWNhbGVzID0gMSwgYWJpZXJ0byA9IHRydWVcclxuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcclxuICAgICAgICAgICAgY29sb3I6IDB4RkZGRkZGLFxyXG4gICAgICAgICAgICBlbWlzc2l2ZTogMHgzMzMzMzMsXHJcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkJhY2tTaWRlLFxyXG4gICAgICAgICAgICBtYXA6IHRleHR1cmFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgxNy41LCAxNy41IC0gMiwgMSwgMTYsIDEsIHRydWUpO1xyXG4gICAgICAgIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbMF0gPSBbXTtcclxuICAgICAgICBqID0gW25ldyBUSFJFRS5WZWN0b3IyKDAsIDEpLCBuZXcgVEhSRUUuVmVjdG9yMigwLCAwKSwgbmV3IFRIUkVFLlZlY3RvcjIoMSwgMSldO1xyXG4gICAgICAgIGsgPSBbbmV3IFRIUkVFLlZlY3RvcjIoMCwgMCksIG5ldyBUSFJFRS5WZWN0b3IyKDEsIDApLCBuZXcgVEhSRUUuVmVjdG9yMigxLCAxKV07XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1swXS5wdXNoKGopO1xyXG4gICAgICAgICAgICBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWzBdLnB1c2goayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYWxsYSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgbWFsbGEubmFtZSA9ICdwbGF0ZnJvbnQnO1xyXG4gICAgICAgIG1hbGxhLnJvdGF0aW9uLnggPSBNYXRoLlBJIC8gMjtcclxuICAgICAgICBtYWxsYS5yb3RhdGlvbi55ID0gMTEuMjUgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICAgIG1hbGxhLnBvc2l0aW9uLnogPSAwLjU7XHJcbiAgICAgICAgdGhpcy5hZGQobWFsbGEpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gIEJBTlFVSUxMT1MgeDE2XHJcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgIGNvbG9yOiAweEZGRkZGRixcclxuICAgICAgICAgICAgZW1pc3NpdmU6IDB4MjIyMjIyLFxyXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGUsXHJcbiAgICAgICAgICAgIG1hcDogdGV4dHVyYVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBnZW9tZXRyeSA9IFtcclxuICAgICAgICAgICAgLy8gIFBPU1RFIElOVEVSTUVESU86IGRpc3RhbmNpYSBkZWwgY2VudHJvID0gMTksIHBvc2ljacOzbiB6ID0gMVxyXG4gICAgICAgICAgICBuZXcgU3RhbmRHZW9tZXRyeSgxNywgMSksXHJcbiAgICAgICAgICAgIC8vICBTT1BPUlRFIFNVUEVSSU9SOiBhbmNobyA9IDcsIGFsdG8gPSAxLjUsIHByb2YgPSAxXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg3LCAxLjUsIDEpLFxyXG4gICAgICAgICAgICAvLyAgVU5Jw5NOIElORkVSSU9SOiBhbmNobyA9IDcsIGFsdG8gPSAxLjIsIHByb2YgPSAxXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg3LCAxLjIsIDEpXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgLy8gICAgICBQT1NURSBJTlRFUk1FRElPXHJcbiAgICAgICAgICAgIG1hbGxhID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnlbMF0sIG1hdGVyaWFsKTtcclxuICAgICAgICAgICAgbWFsbGEucm90YXRpb24ueiA9ICgoaSArIDAuNSkgKiAzNjAgLyAxNikgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICAgICAgICB0aGlzLmFkZChtYWxsYSk7XHJcblxyXG4gICAgICAgICAgICAvLyAgICAgIFNPUE9SVEUgU1VQRVJJT1JcclxuICAgICAgICAgICAgbWFsbGEgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeVsxXSwgbWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBtYWxsYS5yb3RhdGlvbi56ID0gKDkwICsgaSAqIDM2MCAvIDE2KSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgICAgICAgIG1hbGxhLnBvc2l0aW9uLnggPSAxOS4xICogTWF0aC5jb3MoaSAvIDggKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgbWFsbGEucG9zaXRpb24ueSA9IDE5LjEgKiBNYXRoLnNpbihpIC8gOCAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICBtYWxsYS5wb3NpdGlvbi56ID0gOS44O1xyXG4gICAgICAgICAgICB0aGlzLmFkZChtYWxsYSk7XHJcblxyXG4gICAgICAgICAgICAvLyAgICAgIFVOScOTTiBJTkZFUklPUlxyXG4gICAgICAgICAgICBtYWxsYSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5WzJdLCBtYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIG1hbGxhLnJvdGF0aW9uLnogPSAoOTAgKyBpICogMzYwIC8gMTYpICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICAgICAgbWFsbGEucG9zaXRpb24ueCA9IDE3LjUgKiBNYXRoLmNvcyhpIC8gOCAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICBtYWxsYS5wb3NpdGlvbi55ID0gMTcuNSAqIE1hdGguc2luKGkgLyA4ICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIG1hbGxhLnBvc2l0aW9uLnogPSAxLjY7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKG1hbGxhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICBUVUJPIENJUkNVTEFSXHJcbiAgICAgICAgLy8gIHJhZGlvID0gMTguMiwgZGlhbWV0cm8gPSAwLjM1LCBzZWdtUmFkaWFsZXMgPSAxNiwgc2VnbVR1YnVsYXJlcyA9IDgwXHJcbiAgICAgICAgdGV4dHVyYSA9IFRFWFRVUkVTLkNMT1VEUztcclxuICAgICAgICB0ZXh0dXJhLndyYXBUID0gdGV4dHVyYS53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xyXG4gICAgICAgIHRleHR1cmEucmVwZWF0LnNldCgzMCwgMSk7XHJcblxyXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xyXG4gICAgICAgICAgICBjb2xvcjogMHgzMzg5OEYsXHJcbiAgICAgICAgICAgIGVtaXNzaXZlOiAweDMzODk4RixcclxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxyXG4gICAgICAgICAgICBtYXA6IHRleHR1cmFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSgxNi4yLCAwLjM1LCAxMCwgODApO1xyXG5cclxuICAgICAgICBtYWxsYSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgICAgbWFsbGEucG9zaXRpb24ueiA9IDEwLjE7XHJcbiAgICAgICAgdGhpcy5hZGQobWFsbGEpO1xyXG5cclxuICAgICAgICB0ZXh0dXJhID0gbWF0ZXJpYWwgPSBnZW9tZXRyeSA9IG1hbGxhID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQ291cnRyb29tLCB7XHJcbiAgICBURVhUVVJFX1JFTEFUSVZFX1VSSTogeyB2YWx1ZTogJy9yZXNvdXJjZXMvdGV4dHVyZXMvJyB9LFxyXG4gICAgQ3lsaW5kZXJCdWZmZXJHZW9tZXRyeTogeyB2YWx1ZTogQ3lsaW5kZXJCdWZmZXJHZW9tZXRyeSB9LFxyXG4gICAgUGxhdGZvcm1CdWZmZXJHZW9tZXRyeTogeyB2YWx1ZTogUGxhdGZvcm1CdWZmZXJHZW9tZXRyeSB9LFxyXG4gICAgU3RhbmRHZW9tZXRyeTogeyB2YWx1ZTogU3RhbmRHZW9tZXRyeSB9LFxyXG4gICAgRmxvb3I6IHsgdmFsdWU6IEZsb29yIH0sXHJcbiAgICBXYWxsczogeyB2YWx1ZTogV2FsbHMgfSxcclxuICAgIEV4aXRzOiB7IHZhbHVlOiBFeGl0cyB9LFxyXG4gICAgUGxhdGZvcm06IHsgdmFsdWU6IFBsYXRmb3JtIH0sXHJcbiAgICBUcmlhbFN0YW5kczogeyB2YWx1ZTogVHJpYWxTdGFuZHMgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvdXJ0cm9vbSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEN5bGluZGVyQnVmZmVyR2VvbWV0cnkgZXh0ZW5kcyBUSFJFRS5CdWZmZXJHZW9tZXRyeVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihzaWRlcywgaGVpZ2h0LCBhcG90aGVtKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMudHlwZSA9ICdDeWxpbmRlckJ1ZmZlckdlb21ldHJ5JztcclxuXHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IGFwb3RoZW0gLyBNYXRoLmNvcyhNYXRoLlBJIC8gc2lkZXMpO1xyXG5cclxuICAgICAgICB2YXIgcyxcclxuICAgICAgICAgICAgdGhpc194LCB0aGlzX3ksIG5leHRfeCwgbmV4dF95LFxyXG4gICAgICAgICAgICBhbmdsZSA9ICgyICogTWF0aC5QSSkgLyBzaWRlcyxcclxuXHJcbiAgICAgICAgICAgIHZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShzaWRlcyAqIDYgKiAzKSxcclxuICAgICAgICAgICAgdXZzID0gbmV3IEZsb2F0MzJBcnJheShzaWRlcyAqIDYgKiAyKTtcclxuXHJcbiAgICAgICAgZm9yIChzID0gMDsgcyA8PSBzaWRlczsgcysrKSB7XHJcbiAgICAgICAgICAgIHRoaXNfeCA9IHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlICogKHMgLSAwLjUpKTtcclxuICAgICAgICAgICAgdGhpc195ID0gcmFkaXVzICogTWF0aC5zaW4oYW5nbGUgKiAocyAtIDAuNSkpO1xyXG4gICAgICAgICAgICBuZXh0X3ggPSByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSAqIChzICsgMC41KSk7XHJcbiAgICAgICAgICAgIG5leHRfeSA9IHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlICogKHMgKyAwLjUpKTtcclxuXHJcbiAgICAgICAgICAgIC8vICh4LHkpID0gMSwxIDogVG9wIHJpZ2h0IHZlcnRleFxyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgMF0gPSAxO1xyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgMV0gPSAxO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tzICogMTggKyAwXSA9IG5leHRfeDtcclxuICAgICAgICAgICAgdmVydGljZXNbcyAqIDE4ICsgMV0gPSBuZXh0X3k7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW3MgKiAxOCArIDJdID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICAvLyAoeCx5KSA9IDAsMSA6IFRvcCBsZWZ0IHZlcnRleFxyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgMl0gPSAwO1xyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgM10gPSAxO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tzICogMTggKyAzXSA9IHRoaXNfeDtcclxuICAgICAgICAgICAgdmVydGljZXNbcyAqIDE4ICsgNF0gPSB0aGlzX3k7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW3MgKiAxOCArIDVdID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICAvLyAoeCx5KSA9IDAsMCA6IEJvdHRvbSBsZWZ0IHZlcnRleFxyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgNF0gPSAwO1xyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgNV0gPSAwO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tzICogMTggKyA2XSA9IHRoaXNfeDtcclxuICAgICAgICAgICAgdmVydGljZXNbcyAqIDE4ICsgN10gPSB0aGlzX3k7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW3MgKiAxOCArIDhdID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vICh4LHkpID0gMCwwIDogQm90dG9tIGxlZnQgdmVydGV4XHJcbiAgICAgICAgICAgIHV2c1tzICogMTIgKyA2XSA9IDA7XHJcbiAgICAgICAgICAgIHV2c1tzICogMTIgKyA3XSA9IDA7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW3MgKiAxOCArIDldID0gdGhpc194O1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tzICogMTggKyAxMF0gPSB0aGlzX3k7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW3MgKiAxOCArIDExXSA9IDA7XHJcbiAgICAgICAgICAgIC8vICh4LHkpID0gMSwwIDogQm90dG9tIHJpZ2h0IHZlcnRleFxyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgOF0gPSAxO1xyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgOV0gPSAwO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tzICogMTggKyAxMl0gPSBuZXh0X3g7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW3MgKiAxOCArIDEzXSA9IG5leHRfeTtcclxuICAgICAgICAgICAgdmVydGljZXNbcyAqIDE4ICsgMTRdID0gMDtcclxuICAgICAgICAgICAgLy8gKHgseSkgPSAxLDEgOiBUb3AgcmlnaHQgdmVydGV4XHJcbiAgICAgICAgICAgIHV2c1tzICogMTIgKyAxMF0gPSAxO1xyXG4gICAgICAgICAgICB1dnNbcyAqIDEyICsgMTFdID0gMTtcclxuICAgICAgICAgICAgdmVydGljZXNbcyAqIDE4ICsgMTVdID0gbmV4dF94O1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tzICogMTggKyAxNl0gPSBuZXh0X3k7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW3MgKiAxOCArIDE3XSA9IGhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQXR0cmlidXRlKCdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUodmVydGljZXMsIDMpKTtcclxuICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZSgndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHV2cywgMikpO1xyXG5cclxuICAgICAgICB0aGlzX3ggPSB0aGlzX3kgPSBudWxsO1xyXG4gICAgICAgIG5leHRfeCA9IG5leHRfeSA9IG51bGw7XHJcbiAgICAgICAgdXZzID0gbnVsbDtcclxuICAgICAgICB2ZXJ0aWNlcyA9IG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgU3RhZ2UgZnJvbSAnLi9TdGFnZS5qcyc7XHJcblxyXG5pbXBvcnQgRGlzY3Vzc2lvbkFuaW1hdGlvbiBmcm9tICcuL2FuaW1hdGlvbi9EaXNjdXNzaW9uQW5pbWF0aW9uLmpzJztcclxuaW1wb3J0IERpc2N1c3Npb25TY3JlZW4gZnJvbSAnLi9odWQvRGlzY3Vzc2lvblNjcmVlbi5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNjdXNzaW9uU3RhZ2UgZXh0ZW5kcyBTdGFnZVxyXG57XHJcblx0Y29uc3RydWN0b3IodHJpYWwpXHJcblx0e1xyXG5cdFx0c3VwZXIodHJpYWwpO1xyXG5cclxuXHRcdHRoaXMuc2NyZWVuID0gbmV3IERpc2N1c3Npb25TY3JlZW4odGhpcy5odWRSZW5kZXJlci5jdHgpO1xyXG5cdFx0dGhpcy5odWRSZW5kZXJlci5zY3JlZW4gPSB0aGlzLnNjcmVlbjtcclxuXHJcblx0XHR0aGlzLmFuaW1hdGlvbiA9IG5ldyBEaXNjdXNzaW9uQW5pbWF0aW9uKHRyaWFsLnJlbmRlcmVyKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0aW1lKVxyXG5cdHtcclxuXHRcdHRoaXMuc2NlbmVSZW5kZXJlciAmJiB0aGlzLnNjZW5lUmVuZGVyZXIucmVuZGVyKHRpbWUpO1xyXG5cdFx0dGhpcy5odWRSZW5kZXJlciAmJiB0aGlzLmh1ZFJlbmRlcmVyLnJlbmRlcih0aW1lKTtcclxuXHRcdHRoaXMuYXVkaW9SZW5kZXJlciAmJiB0aGlzLmF1ZGlvUmVuZGVyZXIucmVuZGVyKHRpbWUpO1xyXG5cdH1cclxuXHJcblx0cHJvbWlzZUNoYWluRm9yRGlhbG9ndWUoc3BlYWtlciwgbGluZXMsIHRob3VnaHQpXHJcblx0e1xyXG5cdFx0bGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XHJcblxyXG5cdFx0Zm9yIChsZXQgbGluZSwgaSA9IDA7IGxpbmUgPSBsaW5lc1tpXTsgaSsrKSB7XHJcblx0XHRcdHByb21pc2UgPSBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuc2NyZWVuLnNldERpYWxvZ3VlKHRoaXMuY2hhcmFjdGVyc1tzcGVha2VyXSwgbGluZSwgdGhvdWdodCk7XHJcblxyXG5cdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChyZXNvbHZlLCBNYXRoLm1heCgyNTAwLCBsaW5lLmxlbmd0aCAqIDUwKSk7XHJcblx0XHRcdFx0XHRsaW5lID0gbnVsbDtcclxuXHRcdFx0XHRcdGkgPSBudWxsO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LmJpbmQodGhpcykpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwcm9taXNlO1xyXG5cdH1cclxuXHJcblx0cXVldWVOYXJyYXRvclNjcmlwdChibG9jaylcclxuXHR7XHJcblx0XHR0aGlzLmV2ZW50Y2hhaW4gPSB0aGlzLmV2ZW50Y2hhaW4udGhlbihmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGxldCBwcm9taXNlcyA9IFtdO1xyXG5cclxuXHRcdFx0cHJvbWlzZXNbMF0gPSB0aGlzLnByb21pc2VDaGFpbkZvckRpYWxvZ3VlKGJsb2NrLnNwZWFrZXIsIGJsb2NrLmRpYWxvZ3VlKTtcclxuXHRcdFx0dGhpcy5hbmltYXRpb24udHV0b3JpYWwoKTtcclxuXHJcblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcblx0XHR9LmJpbmQodGhpcykpO1xyXG5cdH1cclxuXHJcblx0cXVldWVDaGFyYWN0ZXJTY3JpcHQoYmxvY2spXHJcblx0e1xyXG5cdFx0dGhpcy5ldmVudGNoYWluID0gdGhpcy5ldmVudGNoYWluLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRsZXQgcHJvbWlzZXMgPSBbXTtcclxuXHJcblx0XHRcdHByb21pc2VzWzBdID0gdGhpcy5wcm9taXNlQ2hhaW5Gb3JEaWFsb2d1ZShibG9jay5zcGVha2VyLCBibG9jay5kaWFsb2d1ZSwgYmxvY2sudGhvdWdodCk7XHJcblxyXG5cdFx0XHRpZiAoJ3Nwcml0ZScgaW4gYmxvY2spXHJcblx0XHRcdFx0dGhpcy5jaGFyYWN0ZXJzW2Jsb2NrLnNwZWFrZXJdLnNwcml0ZSA9IGJsb2NrLnNwcml0ZTtcclxuXHJcblx0XHRcdHByb21pc2VzWzFdID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcblxyXG5cdFx0XHRpZiAoJ2NhbWVyYScgaW4gYmxvY2spXHJcblx0XHRcdFx0cHJvbWlzZXNbMV0gPSBwcm9taXNlc1sxXS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmFuaW1hdGlvbi5jdXRUbyhibG9jay5jYW1lcmEpO1xyXG5cdFx0XHRcdH0uYmluZCh0aGlzKSk7XHJcblxyXG5cdFx0XHRpZiAoJ2FuaW1hdGlvbicgaW4gYmxvY2spIHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrLmFuaW1hdGlvbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0cHJvbWlzZXNbMV0gPSBwcm9taXNlc1sxXS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuYW5pbWF0aW9uLnRyYW5zaWNpb24oYmxvY2suYW5pbWF0aW9uW2ldKTtcclxuXHRcdFx0XHRcdH0uYmluZCh0aGlzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG5cdFx0fS5iaW5kKHRoaXMpKTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBIdWRSZW5kZXJlclxyXG57XHJcblx0Y29uc3RydWN0b3Iod2lkdGgsIGhlaWdodClcclxuXHR7XHJcblx0XHR0aGlzLlcgPSB3aWR0aDtcclxuXHRcdHRoaXMuSCA9IGhlaWdodDtcclxuXHJcblx0XHRsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblxyXG5cdFx0Y2FudmFzLndpZHRoID0gd2lkdGg7XHJcblx0XHRjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuXHRcdHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5cdFx0dGhpcy5ibGFja1NjcmVlbiA9IDA7XHJcblxyXG5cdFx0Y2FudmFzID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdGdldCBjYW52YXMoKVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLmN0eC5jYW52YXM7XHJcblx0fVxyXG5cclxuXHRkcmF3QmxhY2tTY3JlZW4ob3BhY2l0eSlcclxuXHR7XHJcblx0XHR0aGlzLmN0eC5zYXZlKCk7XHJcblxyXG5cdFx0dGhpcy5jdHguZ2xvYmFsQWxwaGEgPSBNYXRoLm1pbih0aGlzLmJsYWNrU2NyZWVuLCAxKTtcclxuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcclxuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuVywgdGhpcy5IKTtcclxuXHJcblx0XHR0aGlzLmN0eC5yZXN0b3JlKCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIodGltZSlcclxuXHR7XHJcblx0XHR0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5XLCB0aGlzLkgpO1xyXG5cclxuXHRcdHRoaXMucHJvY2Vzc29yICYmIHRoaXMucHJvY2Vzc29yKHRpbWUpO1xyXG5cclxuXHRcdGlmICh0aGlzLnNjcmVlbilcclxuXHRcdFx0dGhpcy5zY3JlZW4uZHJhdyh0aW1lKTtcclxuXHJcblx0XHRpZiAodGhpcy5ibGFja1NjcmVlbiA+IDApXHJcblx0XHRcdHRoaXMuZHJhd0JsYWNrU2NyZWVuKCk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhdGZvcm1CdWZmZXJHZW9tZXRyeSBleHRlbmRzIFRIUkVFLkJ1ZmZlckdlb21ldHJ5XHJcbntcclxuICAgIGNvbnN0cnVjdG9yKHJhZGl1c0ludGVybmFsLCByYWRpdXNFeHRlcm5hbCwgc2VnbWVudHMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy50eXBlID0gJ1BsYXRmb3JtQnVmZmVyR2VvbWV0cnknO1xyXG5cclxuICAgICAgICByYWRpdXNJbnRlcm5hbCA9IHJhZGl1c0ludGVybmFsIHx8IDIwO1xyXG4gICAgICAgIHJhZGl1c0V4dGVybmFsID0gcmFkaXVzRXh0ZXJuYWwgfHwgMzE7XHJcbiAgICAgICAgc2VnbWVudHMgPSBzZWdtZW50cyB8fCAzMjtcclxuXHJcbiAgICAgICAgdmFyIHMsXHJcbiAgICAgICAgICAgIHRoaXNfeCwgdGhpc195LCBuZXh0X3gsIG5leHRfeSxcclxuICAgICAgICAgICAgYW5nbGUgPSAoMiAqIE1hdGguUEkpIC8gc2VnbWVudHMsXHJcblxyXG4gICAgICAgICAgICB2ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoc2VnbWVudHMgKiA2ICogMyksXHJcbiAgICAgICAgICAgIHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoc2VnbWVudHMgKiA2ICogMik7XHJcblxyXG4gICAgICAgIGZvciAocyA9IDA7IHMgPCBzZWdtZW50czsgcysrKSB7XHJcbiAgICAgICAgICAgIHRoaXNfeCA9IE1hdGguY29zKGFuZ2xlICogcyk7XHJcbiAgICAgICAgICAgIHRoaXNfeSA9IE1hdGguc2luKGFuZ2xlICogcyk7XHJcbiAgICAgICAgICAgIG5leHRfeCA9IE1hdGguY29zKGFuZ2xlICogKHMrMSkpO1xyXG4gICAgICAgICAgICBuZXh0X3kgPSBNYXRoLnNpbihhbmdsZSAqIChzKzEpKTtcclxuXHJcbiAgICAgICAgICAgIHV2c1sxMiAqIHMgKyAgMF0gPSAwO1xyXG4gICAgICAgICAgICB1dnNbMTIgKiBzICsgIDFdID0gMDtcclxuICAgICAgICAgICAgdmVydGljZXNbMTggKiBzICsgIDBdID0gcmFkaXVzSW50ZXJuYWwgKiB0aGlzX3g7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzWzE4ICogcyArICAxXSA9IHJhZGl1c0ludGVybmFsICogdGhpc195O1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1sxOCAqIHMgKyAgMl0gPSAwO1xyXG5cclxuICAgICAgICAgICAgdXZzWzEyICogcyArICAyXSA9IDE7XHJcbiAgICAgICAgICAgIHV2c1sxMiAqIHMgKyAgM10gPSAwO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1sxOCAqIHMgKyAgM10gPSByYWRpdXNFeHRlcm5hbCAqIHRoaXNfeDtcclxuICAgICAgICAgICAgdmVydGljZXNbMTggKiBzICsgIDRdID0gcmFkaXVzRXh0ZXJuYWwgKiB0aGlzX3k7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzWzE4ICogcyArICA1XSA9IDA7XHJcblxyXG4gICAgICAgICAgICB1dnNbMTIgKiBzICsgIDRdID0gMTtcclxuICAgICAgICAgICAgdXZzWzEyICogcyArICA1XSA9IDE7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzWzE4ICogcyArICA2XSA9IHJhZGl1c0V4dGVybmFsICogbmV4dF94O1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1sxOCAqIHMgKyAgN10gPSByYWRpdXNFeHRlcm5hbCAqIG5leHRfeTtcclxuICAgICAgICAgICAgdmVydGljZXNbMTggKiBzICsgIDhdID0gMDtcclxuXHJcblxyXG4gICAgICAgICAgICB1dnNbMTIgKiBzICsgIDZdID0gMTtcclxuICAgICAgICAgICAgdXZzWzEyICogcyArICA3XSA9IDE7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzWzE4ICogcyArICA5XSA9IHJhZGl1c0V4dGVybmFsICogbmV4dF94O1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1sxOCAqIHMgKyAxMF0gPSByYWRpdXNFeHRlcm5hbCAqIG5leHRfeTtcclxuICAgICAgICAgICAgdmVydGljZXNbMTggKiBzICsgMTFdID0gMDtcclxuXHJcbiAgICAgICAgICAgIHV2c1sxMiAqIHMgKyAgOF0gPSAwO1xyXG4gICAgICAgICAgICB1dnNbMTIgKiBzICsgIDldID0gMTtcclxuICAgICAgICAgICAgdmVydGljZXNbMTggKiBzICsgMTJdID0gcmFkaXVzSW50ZXJuYWwgKiBuZXh0X3g7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzWzE4ICogcyArIDEzXSA9IHJhZGl1c0ludGVybmFsICogbmV4dF95O1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1sxOCAqIHMgKyAxNF0gPSAwO1xyXG5cclxuICAgICAgICAgICAgdXZzWzEyICogcyArIDEwXSA9IDA7XHJcbiAgICAgICAgICAgIHV2c1sxMiAqIHMgKyAxMV0gPSAwO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1sxOCAqIHMgKyAxNV0gPSByYWRpdXNJbnRlcm5hbCAqIHRoaXNfeDtcclxuICAgICAgICAgICAgdmVydGljZXNbMTggKiBzICsgMTZdID0gcmFkaXVzSW50ZXJuYWwgKiB0aGlzX3k7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzWzE4ICogcyArIDE3XSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHZlcnRpY2VzLCAzKSk7XHJcbiAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGUoJ3V2JywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSh1dnMsIDIpKTtcclxuICAgICAgICAvL3RoaXMuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcclxuXHJcbiAgICAgICAgdGhpc194ID0gdGhpc195ID0gbnVsbDtcclxuICAgICAgICBuZXh0X3ggPSBuZXh0X3kgPSBudWxsO1xyXG4gICAgICAgIHV2cyA9IG51bGw7XHJcbiAgICAgICAgdmVydGljZXMgPSBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENoYXJhY3RlckNhcmQgZnJvbSAnLi9DaGFyYWN0ZXJDYXJkLmpzJztcclxuXHJcbi8vIEknbSByZWFsbHkgdGVtcHRlZCB0byBleHRlbmQgV2ViR0xSZW5kZXJlciBmb3IgdGhpcyxcclxuLy8gYnV0IGl0IG1pZ2h0IGJyZWFrIHNvbWV0aGluZy5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVSZW5kZXJlclxyXG57XHJcblx0Y29uc3RydWN0b3Iod2lkdGgsIGhlaWdodClcclxuXHR7XHJcblx0XHR0aGlzLlcgPSB3aWR0aDtcclxuXHRcdHRoaXMuSCA9IGhlaWdodDtcclxuXHJcblx0XHR0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xyXG5cdFx0XHRhbnRpYWxpYXM6IHRydWUsXHJcblx0XHRcdC8vIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xyXG5cdFx0dGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwLCAxKTtcclxuXHRcdHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcblx0XHR0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcblxyXG5cdFx0dmFyIGxpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZmZmZmYsIDEuNSwgMTMwKTtcclxuXHRcdGxpZ2h0LnBvc2l0aW9uLnNldCgwLCAwLCAzMCk7XHJcblx0XHR0aGlzLnNjZW5lLmFkZChsaWdodCk7XHJcblxyXG5cdFx0dGhpcy5jYW1lcmFzID0gW107XHJcblx0XHR0aGlzLm1haW5DYW1lcmEgPSBudWxsO1xyXG5cclxuXHRcdHRoaXMucHJvY2Vzc29yID0gbnVsbDtcclxuXHJcblx0XHR0aGlzLmFkZEVsZW1lbnQgPSB0aGlzLnNjZW5lLmFkZC5iaW5kKHRoaXMuc2NlbmUpO1xyXG5cdH1cclxuXHJcblx0Z2V0IGNhbnZhcygpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudDtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0aW1lKVxyXG5cdHtcclxuXHRcdHRoaXMucHJvY2Vzc29yICYmIHRoaXMucHJvY2Vzc29yKHRpbWUpO1xyXG5cdFx0dGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5tYWluQ2FtZXJhKTtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZUNhbWVyYShwYXJhbXMpXHJcblx0e1xyXG5cdFx0bGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg0NSwgdGhpcy5XIC8gdGhpcy5ILCAxLCAzMDApO1xyXG5cclxuXHRcdGNhbWVyYS5wb3NpdGlvbi5zZXQoMTAsIDEwLCAxMCk7XHJcblx0XHRjYW1lcmEudXAuc2V0KDAsIDAsIDEpO1xyXG5cdFx0Y2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxMCkpO1xyXG5cclxuXHRcdHRoaXMuc2NlbmUuYWRkKGNhbWVyYSk7XHJcblxyXG5cdFx0dGhpcy5jYW1lcmFzLnB1c2goY2FtZXJhKTtcclxuXHRcdHRoaXMubWFpbkNhbWVyYSA9IGNhbWVyYTtcclxuXHR9XHJcblxyXG5cdGxvY2F0ZUNoYXJhY3RlcihjaGFyYWN0ZXIsIHBvc2l0aW9uKVxyXG5cdHtcclxuXHRcdGxldCBjYXJkID0gbmV3IENoYXJhY3RlckNhcmQoY2hhcmFjdGVyKTtcclxuXHJcblx0XHRjYXJkLmNvdW50ZXIgPSBNYXRoLmFicyhwb3NpdGlvbiAlIDE2KTtcclxuXHJcblx0XHRsZXQgYW5nID0gKGNhcmQuY291bnRlciAvIDE2KSAqICgyICogTWF0aC5QSSk7XHJcblxyXG5cdFx0Y2FyZC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7XHJcblx0XHRjYXJkLnJvdGF0aW9uLnkgPSBhbmcgLSBNYXRoLlBJIC8gMjtcclxuXHJcblx0XHRjYXJkLnBvc2l0aW9uLnNldChcclxuXHRcdFx0KDIzIC0gMC41ICogTWF0aC5wb3coLTEsIHBvc2l0aW9uKSkgKiBNYXRoLmNvcyhhbmcpLFxyXG5cdFx0XHQoMjMgLSAwLjUgKiBNYXRoLnBvdygtMSwgcG9zaXRpb24pKSAqIE1hdGguc2luKGFuZyksXHJcblx0XHRcdDExKTtcclxuXHJcblx0XHR0aGlzLnNjZW5lLmFkZChjYXJkKTtcclxuXHJcblx0XHRhbmcgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0Ly8gVE9ETzogZmluZCBhIGJldHRlciB3YXlcclxuXHRoZUlzSGVyZSh0aGViZWFyKVxyXG5cdHtcclxuXHRcdGxldCBjYXJkID0gbmV3IENoYXJhY3RlckNhcmQodGhlYmVhcik7XHJcblxyXG5cdFx0Y2FyZC5mcm9udC5nZW9tZXRyeSA9IChjYXJkLmJhY2suZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgxMCwgMTApKTtcclxuXHJcblx0XHRjYXJkLnJvdGF0aW9uLnggPSBNYXRoLlBJIC8gMjtcclxuXHRcdGNhcmQucm90YXRpb24ueSA9IE1hdGguUEkgLyAyO1xyXG5cclxuXHRcdGNhcmQucG9zaXRpb24uc2V0KC01MCwgMCwgMTkpO1xyXG5cclxuXHRcdHZhciBjdWJlID0gbmV3IFRIUkVFLk1lc2goXHJcblx0XHRcdG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggMTQsIDEwLCAxMCApLFxyXG5cdFx0XHRuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgge2NvbG9yOiAweGZmY2MwMH0gKVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdGN1YmUucG9zaXRpb24uc2V0KC01MCwgMCwgNyk7XHJcblxyXG5cdFx0Y3ViZS5yb3RhdGlvbi55ID0gTWF0aC5QSSAvIDI7XHJcblxyXG5cdFx0dGhpcy5zY2VuZS5hZGQoIGNhcmQgKTtcclxuXHRcdHRoaXMuc2NlbmUuYWRkKCBjdWJlICk7XHJcblx0fVxyXG5cclxuXHQvLyBJIHN0aWxsIGRvbid0IGtub3cgaG93LCBidXQgdGhpcyB3aWxsIGJlIHVzZWZ1bCBmb3IgdGhlIENyb3NzIFN3b3JkIFNob3dkb3duXHJcblx0cmVuZGVySGFsZigpXHJcblx0e1xyXG5cdFx0dGhpcy5yZW5kZXJlci5zZXRWaWV3cG9ydCgwLCAwLCB0aGlzLldJRFRILCB0aGlzLkhFSUdIVCk7XHJcblx0XHR0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XHJcblxyXG5cdFx0Ly8gTGVmdCBzaWRlXHJcblx0XHR0aGlzLnJlbmRlcmVyLnNldFZpZXdwb3J0KDEsIDEsIDAuNSAqIHRoaXMuV0lEVEggLSAyLCB0aGlzLkhFSUdIVCAtIDIpO1xyXG5cdFx0dGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5tYWluQ2FtZXJhKTtcclxuXHJcblx0XHQvLyBSaWdodCBzaWRlXHJcblx0XHR0aGlzLnJlbmRlcmVyLnNldFZpZXdwb3J0KDAuNSAqIHRoaXMuV0lEVEggKyAxLCAxLCAwLjUgKiB0aGlzLldJRFRIIC0gMiwgdGhpcy5IRUlHSFQgLSAyKTtcclxuXHRcdHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMucmlnaHRDYW1lcmEpO1xyXG5cdH1cclxufSIsIi8qXHJcbiAqIGNsYXNzIFNUQUdFXHJcbiAqXHJcbiAqIFRoZSBTdGFnZSBvYmplY3QgaG9sZHMgYW5kIGNvbnRyb2xzIGFsbCB0aGUgY2hpbGRyZW4gZWxlbWVudHMgaW52b2x2ZWQgaW4gdGhlIGdhbWUuXHJcbiAqIElzIGNvbXBvc2VkLCBidXQgbm90IGxpbWl0ZWQgdG8sIGJ5XHJcbiAqIC0gYSBTY2VuZSBSZW5kZXJlcjogaW4gdGhpcyBjYXNlLCB0aGUgVGhyZWUuanMgV2ViR0wgUmVuZGVyZXIsXHJcbiAqIC0gYSBIVUQgUmVuZGVyZXI6IGNhbiBiZSB0aGUgb25lIGluY2x1ZGVkIG9yIGEgY3VzdG9tIG9uZSxcclxuICogLSBhbiBBdWRpbyBSZW5kZXJlcjogd29yayBpbiBwcm9ncmVzc1xyXG4gKlxyXG4gKiBFYWNoIHN0YWdlIG9mIHRoZSBnYW1lIGlzIGNvbnRyb2xsZWQgYnkgYSBkaWZmZXJlbnQgc3ViY2xhc3Mgb2YgdGhpcyBjbGFzcywgYW5kIHdpbGwgYmUgc3dpdGNoZWRcclxuICogZGVwZW5kaW5nIG9uIHRoZSBnYW1lJ3Mgc2NyaXB0LlxyXG4gKlxyXG4gKiBBbGwgdGhlIFJlbmRlcmVycyBtdXN0IGhhdmUgdGhlIHNhbWUgc3RydWN0dXJlIGFzIGEgVGhyZWUuanMgUmVuZGVyZXI7IGEgcmVuZGVyKCkgbWV0aG9kXHJcbiAqIG11c3QgYmUgYXZhaWxhYmxlIHRvIGJlIGNhbGxlZCBvbiBldmVyeSBmcmFtZS5cclxuICpcclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFnZVxyXG57XHJcblx0Y29uc3RydWN0b3IodHJpYWwpXHJcblx0e1xyXG5cdFx0dGhpcy5jaGFyYWN0ZXJzID0gdHJpYWwuY2hhcmFjdGVycztcclxuXHJcblx0XHR0aGlzLnRyaWFsID0gdHJpYWw7XHJcblxyXG5cdFx0dGhpcy5zY2VuZVJlbmRlcmVyID0gdHJpYWwucmVuZGVyZXIuc2NlbmU7XHJcblx0XHR0aGlzLmh1ZFJlbmRlcmVyID0gdHJpYWwucmVuZGVyZXIuaHVkO1xyXG5cdFx0dGhpcy5hdWRpb1JlbmRlcmVyID0gdHJpYWwucmVuZGVyZXIuYXVkaW87XHJcblxyXG5cdFx0dGhpcy5ldmVudGNoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcblx0XHR0aGlzLl9mdW5jID0gW107XHJcblxyXG5cdFx0dGhpcy5jdWFkcm8gPSAwO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKHRpbWUpXHJcblx0e1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdTdGFnZS5yZW5kZXI6IE5vdCBpbXBsZW1lbnRlZC4nKTtcclxuXHR9XHJcblxyXG5cdHN0b3AoKVxyXG5cdHtcclxuXHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuY3VhZHJvKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RlcChmdW5jKVxyXG5cdHtcclxuXHRcdHRoaXMuY3VhZHJvID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmMuYmluZCh0aGlzKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGp1c3RLZWVwUmVuZGVyaW5nKClcclxuXHR7XHJcblx0XHRjb25zdCB0cmFuc2l0aW9uID0gZnVuY3Rpb24odGltZSkge1xyXG5cdFx0XHR0aGlzLnJlbmRlcih0aW1lKTtcclxuXHRcdFx0dGhpcy5jdWFkcm8gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhbnNpdGlvbik7XHJcblx0XHR9LmJpbmQodGhpcyk7XHJcblxyXG5cdFx0dGhpcy5jdWFkcm8gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhbnNpdGlvbik7XHJcblx0fVxyXG5cclxuXHRuZXh0KGZ1bmMpXHJcblx0e1xyXG5cdFx0dGhpcy5ldmVudGNoYWluID0gdGhpcy5ldmVudGNoYWluLnRoZW4oZnVuYy5iaW5kKHRoaXMpKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0bmV4dFByb21pc2UoZnVuYylcclxuXHR7XHJcblx0XHR0aGlzLmV2ZW50Y2hhaW4gPSB0aGlzLmV2ZW50Y2hhaW4udGhlbihmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jLmJpbmQodGhpcykpO1xyXG5cdFx0fS5iaW5kKHRoaXMpKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGRlbGF5UHJvbWlzZSh0aW1lKVxyXG5cdHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XHJcblx0XHRcdHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGVuZChuZXh0U3RhZ2UpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuZXZlbnRjaGFpblxyXG5cdFx0XHQudGhlbihmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hbmltYXRpb24uZXhpdFNwaW4oKTtcclxuXHRcdFx0fS5iaW5kKHRoaXMpKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLnRyaWFsLmNoYW5nZVN0YWdlKG5leHRTdGFnZS5raW5kKTtcclxuXHRcdFx0XHR0aGlzLnRyaWFsLmxvYWRTY3JpcHQobmV4dFN0YWdlLmZpbGUpO1xyXG5cdFx0XHR9LmJpbmQodGhpcykpO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YW5kR2VvbWV0cnkgZXh0ZW5kcyBUSFJFRS5HZW9tZXRyeVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihkaXN0LCBhbHR1KVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQXRyaWxcclxuICAgICAgICB0aGlzLnZlcnRpY2VzLnB1c2goXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuOCwgZGlzdCAtIDIsIGFsdHUgKyAxMC4yKSwgLy8gNCBkZWwgZnJlbnRlICAgMFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMC44LCBkaXN0IC0gMiwgYWx0dSArIDEwLjIpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMC44LCBkaXN0IC0gMiwgYWx0dSArIDguNyksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuOCwgZGlzdCAtIDIsIGFsdHUgKyA4LjcpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLjgsIGRpc3QgKyA0LCBhbHR1ICsgMTAuMiksIC8vIDQgZGV0cmFzICAgICAgNFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMC44LCBkaXN0ICsgNCwgYWx0dSArIDEwLjIpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMC44LCBkaXN0ICsgNCwgYWx0dSArIDguNSksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuOCwgZGlzdCArIDQsIGFsdHUgKyA4LjUpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLjgsIGRpc3QgKyAwLCBhbHR1ICsgNy41KSwgLy8gNCBkZWJham8gICAgICA4XHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0wLjgsIGRpc3QgKyAwLCBhbHR1ICsgNy41KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTAuOCwgZGlzdCArIDMsIGFsdHUgKyA3LjUpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLjgsIGRpc3QgKyAzLCBhbHR1ICsgNy41KVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmZhY2VzLnB1c2goXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygwLCAxLCAyKSwgLy8gRnJlbnRlXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygyLCAzLCAwKSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDMsIDIsIDkpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoOSwgOCwgMyksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMyg0LCA1LCAxKSwgLy8gQXJyaWJhXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygxLCAwLCA0KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDQsIDAsIDMpLCAvLyBEZXJlY2hhXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygzLCA3LCA0KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDcsIDMsIDgpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoOCwgMTEsIDcpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoMSwgNSwgNiksIC8vIEl6cXVpZXJkYVxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoNiwgMiwgMSksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygyLCA2LCAxMCksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygxMCwgOSwgMiksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMyg1LCA0LCA3KSwgLy8gQXRyw6FzXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMyg3LCA2LCA1KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDYsIDcsIDExKSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDExLCAxMCwgNiksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMyg4LCA5LCAxMCksIC8vIEFiYWpvXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygxMCwgMTEsIDgpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIFBvc3RlXHJcbiAgICAgICAgdGhpcy52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLjYsIGRpc3QgKyAwLjIsIGFsdHUgKyA3LjUpLCAvLyA0IGRlbCBmcmVudGUsIDEyXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0wLjYsIGRpc3QgKyAwLjIsIGFsdHUgKyA3LjUpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMC42LCBkaXN0ICsgMC4yLCBhbHR1ICsgMS4xKSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMC42LCBkaXN0ICsgMC4yLCBhbHR1ICsgMS4xKSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTAuNiwgZGlzdCArIDIuOCwgYWx0dSArIDcuNSksIC8vIDQgZGUgYXRyw6FzXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuNiwgZGlzdCArIDIuOCwgYWx0dSArIDcuNSksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuNiwgZGlzdCArIDIuOCwgYWx0dSArIDEuMSksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0wLjYsIGRpc3QgKyAyLjgsIGFsdHUgKyAxLjEpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuZmFjZXMucHVzaChcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDEyLCAxMywgMTQpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoMTQsIDE1LCAxMiksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygxNiwgMTcsIDE4KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDE4LCAxOSwgMTYpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoMTcsIDEyLCAxNSksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygxNSwgMTgsIDE3KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDEzLCAxNiwgMTkpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoMTksIDE0LCAxMylcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gQmFzZVxyXG4gICAgICAgIHRoaXMudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMC44LCBkaXN0ICsgMCwgYWx0dSArIDEuNCksIC8vIDQgZGVsIGZyZW50ZVxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMC44LCBkaXN0ICsgMCwgYWx0dSArIDEuNCksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0wLjgsIGRpc3QgKyAwLCBhbHR1ICsgMC4wKSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMC44LCBkaXN0ICsgMCwgYWx0dSArIDAuMCksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0wLjgsIGRpc3QgKyAzLCBhbHR1ICsgMS40KSwgLy8gMiBzdXBlcmlvcmVzXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAuOCwgZGlzdCArIDMsIGFsdHUgKyAxLjQpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLjgsIGRpc3QgKyA0LCBhbHR1ICsgMC43KSwgLy8gMiBkZWwgYmlzZWxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTAuOCwgZGlzdCArIDQsIGFsdHUgKyAwLjcpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygwLjgsIGRpc3QgKyA0LCBhbHR1ICsgMC4wKSwgLy8gMiBpbmZlcmlvcmVzXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0wLjgsIGRpc3QgKyA0LCBhbHR1ICsgMC4wKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmZhY2VzLnB1c2goXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygyMCwgMjEsIDIyKSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDIyLCAyMywgMjApLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoMjUsIDI0LCAyMSksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygyMSwgMjAsIDI1KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDIwLCAyMywgMjgpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoMjgsIDI2LCAyMCksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygyNiwgMjUsIDIwKSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDI0LCAyNSwgMjYpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoMjYsIDI3LCAyNCksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygyNywgMjYsIDI4KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDI4LCAyOSwgMjcpLFxyXG4gICAgICAgICAgICBuZXcgVEhSRUUuRmFjZTMoMjEsIDI0LCAyNyksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5GYWNlMygyMSwgMjcsIDI5KSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLkZhY2UzKDIxLCAyOSwgMjIpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHZhciBuID0gdGhpcy5mYWNlcy5sZW5ndGggLyAyLFxyXG4gICAgICAgICAgICBqID0gW25ldyBUSFJFRS5WZWN0b3IyKDAsIDEpLCBuZXcgVEhSRUUuVmVjdG9yMigwLCAwKSwgbmV3IFRIUkVFLlZlY3RvcjIoMSwgMSldLFxyXG4gICAgICAgICAgICBrID0gW25ldyBUSFJFRS5WZWN0b3IyKDAsIDApLCBuZXcgVEhSRUUuVmVjdG9yMigxLCAwKSwgbmV3IFRIUkVFLlZlY3RvcjIoMSwgMSldO1xyXG5cclxuICAgICAgICB0aGlzLmZhY2VWZXJ0ZXhVdnNbMF0gPSBbXTtcclxuICAgICAgICB3aGlsZSAobi0tKVxyXG4gICAgICAgICAgICB0aGlzLmZhY2VWZXJ0ZXhVdnNbMF0ucHVzaChqLCBrKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21wdXRlRmFjZU5vcm1hbHMoKTtcclxuICAgICAgICB0aGlzLmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUcmF5ZWN0b3JpYVxyXG57XHJcblx0Y29uc3RydWN0b3IoKVxyXG5cdHtcclxuXHRcdHRoaXMuZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC41LCAzLCAyKTtcclxuXHRcdC8vIHRoaXMubWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHhGRkZGRkYpIH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0VmVjdG9yKHQpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eDogdGhpcy5nZXRYKHQpLFxyXG5cdFx0XHR5OiB0aGlzLmdldFkodCksXHJcblx0XHRcdHo6IHRoaXMuZ2V0Wih0KVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGdldFZlY3RvcjModClcclxuXHR7XHJcblx0XHRyZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjModGhpcy5nZXRYKHQpLCB0aGlzLmdldFkodCksIHRoaXMuZ2V0Wih0KSk7XHJcblx0fVxyXG5cclxuXHQvLyBkcmF3U3RlcChzY2VuZSwgdClcclxuXHQvLyB7XHJcblx0Ly8gXHRsZXQgZXNmZXJhID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCk7XHJcblx0Ly8gXHRlc2ZlcmEucG9zaXRpb24uY29weSh0aGlzLmdldFZlY3Rvcih0KSk7XHJcblx0Ly8gXHRzY2VuZS5hZGQoZXNmZXJhKTtcclxuXHQvLyBcdHJldHVybiBlc2ZlcmE7XHJcblx0Ly8gfVxyXG5cclxuXHRkcmF3UGF0aChzY2VuZSlcclxuXHR7XHJcblx0XHRsZXQgb2JqLFxyXG5cdFx0XHRtYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweEZGRkZGRikgfSksXHJcblx0XHRcdGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gMTsgaSArPSAwLjEpXHJcblx0XHRcdGdlb21ldHJ5LnZlcnRpY2VzLnB1c2goIHRoaXMuZ2V0VmVjdG9yMyhpKSApO1xyXG5cclxuXHRcdG9iaiA9IG5ldyBUSFJFRS5MaW5lKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKTtcclxuXHRcdHNjZW5lLmFkZChvYmopO1xyXG5cdFx0cmV0dXJuIG9iajtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IFRyYXllY3RvcmlhIGZyb20gJy4vVHJheWVjdG9yaWEuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJheWVjdG9yaWFDaXJjdWxhciBleHRlbmRzIFRyYXllY3RvcmlhXHJcbntcclxuXHRjb25zdHJ1Y3RvcihzdGFydCwgZW5kLCBjZW50ZXIpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHRjZW50ZXIgPSBjZW50ZXIgfHwge307XHJcblxyXG5cdFx0dGhpcy5jeCA9IGNlbnRlci54IHx8IDA7XHJcblx0XHR0aGlzLmN5ID0gY2VudGVyLnkgfHwgMDtcclxuXHJcblx0XHR0aGlzLmF4ID0gc3RhcnQueCAtIHRoaXMuY3g7XHJcblx0XHR0aGlzLmJ4ID0gZW5kLnggLSB0aGlzLmN4O1xyXG5cclxuXHRcdHRoaXMuYXkgPSBzdGFydC55IC0gdGhpcy5jeTtcclxuXHRcdHRoaXMuYnkgPSBlbmQueSAtIHRoaXMuY3k7XHJcblxyXG5cdFx0dGhpcy5heiA9IHN0YXJ0Lno7XHJcblx0XHR0aGlzLmR6ID0gZW5kLnogLSBzdGFydC56O1xyXG5cclxuXHRcdHRoaXMuYXIgPSBNYXRoLnNxcnQodGhpcy5heCAqIHRoaXMuYXggKyB0aGlzLmF5ICogdGhpcy5heSk7XHJcblx0XHR0aGlzLmJyID0gTWF0aC5zcXJ0KHRoaXMuYnggKiB0aGlzLmJ4ICsgdGhpcy5ieSAqIHRoaXMuYnkpO1xyXG5cclxuXHRcdHRoaXMuYXAgPSBNYXRoLmF0YW4yKHRoaXMuYXksIHRoaXMuYXgpO1xyXG5cdFx0dGhpcy5icCA9IE1hdGguYXRhbjIodGhpcy5ieSwgdGhpcy5ieCk7XHJcblxyXG5cdFx0Ly8gU2hvcnRlc3QgcGF0aCBmaXhcclxuXHRcdGlmICh0aGlzLmJwIC0gdGhpcy5hcCA+IE1hdGguUEkpXHJcblx0XHRcdHRoaXMuYXAgKz0gMiAqIE1hdGguUEk7XHJcblx0XHRlbHNlIGlmICh0aGlzLmJwIC0gdGhpcy5hcCA8IC1NYXRoLlBJKVxyXG5cdFx0XHR0aGlzLmJwICs9IDIgKiBNYXRoLlBJO1xyXG5cclxuXHRcdHN0YXJ0ID0gbnVsbDtcclxuXHRcdGVuZCA9IG51bGw7XHJcblx0XHRjZW50ZXIgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0Z2V0WCh0KVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLmN4ICsgdGhpcy5nZXRSKHQpICogTWF0aC5jb3ModGhpcy5nZXRQKHQpKTtcclxuXHR9XHJcblxyXG5cdGdldFkodClcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5jeSArIHRoaXMuZ2V0Uih0KSAqIE1hdGguc2luKHRoaXMuZ2V0UCh0KSk7XHJcblx0fVxyXG5cclxuXHRnZXRaKHQpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuYXogKyB0ICogdGhpcy5kejtcclxuXHR9XHJcblxyXG5cdGdldFIodClcclxuXHR7XHJcblx0XHRyZXR1cm4gKDEgLSB0KSAqIHRoaXMuYXIgKyB0ICogdGhpcy5icjtcclxuXHR9XHJcblxyXG5cdGdldFAodClcclxuXHR7XHJcblx0XHRyZXR1cm4gKDEgLSB0KSAqIHRoaXMuYXAgKyB0ICogdGhpcy5icDtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IFRyYXllY3RvcmlhIGZyb20gJy4vVHJheWVjdG9yaWEuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJheWVjdG9yaWFFc2ZlcmljYSBleHRlbmRzIFRyYXllY3RvcmlhXHJcbntcclxuXHRjb25zdHJ1Y3RvcihzdGFydCwgZW5kLCBjZW50ZXIpXHJcblx0e1xyXG5cdFx0c3VwZXIoc3RhcnQsIGVuZCk7XHJcblxyXG5cdFx0Y2VudGVyID0gY2VudGVyIHx8IHt9O1xyXG5cclxuXHRcdHRoaXMuY3ggPSBjZW50ZXIueCB8fCAwO1xyXG5cdFx0dGhpcy5jeSA9IGNlbnRlci55IHx8IDA7XHJcblx0XHR0aGlzLmN6ID0gY2VudGVyLnogfHwgMDtcclxuXHJcblx0XHR0aGlzLmF4ID0gc3RhcnQueCAtIHRoaXMuY3g7XHJcblx0XHR0aGlzLmF5ID0gc3RhcnQueSAtIHRoaXMuY3k7XHJcblx0XHR0aGlzLmF6ID0gc3RhcnQueiAtIHRoaXMuY3o7XHJcblxyXG5cdFx0dGhpcy5hciA9IE1hdGguc3FydCh0aGlzLmF4ICogdGhpcy5heCArIHRoaXMuYXkgKiB0aGlzLmF5ICsgdGhpcy5heiAqIHRoaXMuYXopO1xyXG5cdFx0dGhpcy5hcCA9IE1hdGguYXRhbjIodGhpcy5heSwgdGhpcy5heCk7XHJcblx0XHR0aGlzLmF0ID0gTWF0aC5hY29zKHRoaXMuYXogLyBNYXRoLnNxcnQodGhpcy5heCAqIHRoaXMuYXggKyB0aGlzLmF5ICogdGhpcy5heSArIHRoaXMuYXogKiB0aGlzLmF6KSk7XHJcblxyXG5cclxuXHRcdHRoaXMuYnggPSBlbmQueCAtIHRoaXMuY3g7XHJcblx0XHR0aGlzLmJ5ID0gZW5kLnkgLSB0aGlzLmN5O1xyXG5cdFx0dGhpcy5ieiA9IGVuZC56IC0gdGhpcy5jejtcclxuXHJcblx0XHR0aGlzLmJyID0gTWF0aC5zcXJ0KHRoaXMuYnggKiB0aGlzLmJ4ICsgdGhpcy5ieSAqIHRoaXMuYnkgKyB0aGlzLmJ6ICogdGhpcy5ieik7XHJcblx0XHR0aGlzLmJwID0gTWF0aC5hdGFuMih0aGlzLmJ5LCB0aGlzLmJ4KTtcclxuXHRcdHRoaXMuYnQgPSBNYXRoLmFjb3ModGhpcy5ieiAvIE1hdGguc3FydCh0aGlzLmJ4ICogdGhpcy5ieCArIHRoaXMuYnkgKiB0aGlzLmJ5ICsgdGhpcy5ieiAqIHRoaXMuYnopKTtcclxuXHJcblx0XHQvLyBTaG9ydGVzdCBwYXRoIGZpeFxyXG5cdFx0aWYgKHRoaXMuYnAgLSB0aGlzLmFwID4gTWF0aC5QSSlcclxuXHRcdFx0dGhpcy5hcCArPSAyICogTWF0aC5QSTtcclxuXHRcdGVsc2UgaWYgKHRoaXMuYnAgLSB0aGlzLmFwIDwgLU1hdGguUEkpXHJcblx0XHRcdHRoaXMuYnAgKz0gMiAqIE1hdGguUEk7XHJcblxyXG5cdFx0c3RhcnQgPSBudWxsO1xyXG5cdFx0ZW5kID0gbnVsbDtcclxuXHRcdGNlbnRlciA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRnZXRYKHQpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMucGF0aCA9PSAnc3BoZXJpY2FsJylcclxuXHRcdFx0cmV0dXJuIHRoaXMuY3ggKyB0aGlzLmdldFIodCkgKiBNYXRoLnNpbih0aGlzLmdldFQodCkpICogTWF0aC5jb3ModGhpcy5nZXRQKHQpKTtcclxuXHJcblx0XHRpZiAodGhpcy5wYXRoID09ICdjaXJjdWxhcicpXHJcblx0XHRcdHJldHVybiB0aGlzLmN4ICsgdGhpcy5nZXRSKHQpICogTWF0aC5jb3ModGhpcy5nZXRQKHQpKTtcclxuXHJcblx0XHRyZXR1cm4gKDEgLSB0KSAqIHRoaXMuYXggKyB0ICogdGhpcy5ieDtcclxuXHR9XHJcblxyXG5cdGdldFkodClcclxuXHR7XHJcblx0XHRpZiAodGhpcy5wYXRoID09ICdzcGhlcmljYWwnKVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jeSArIHRoaXMuZ2V0Uih0KSAqIE1hdGguc2luKHRoaXMuZ2V0VCh0KSkgKiBNYXRoLnNpbih0aGlzLmdldFAodCkpO1xyXG5cclxuXHRcdGlmICh0aGlzLnBhdGggPT0gJ2NpcmN1bGFyJylcclxuXHRcdFx0cmV0dXJuIHRoaXMuY3kgKyB0aGlzLmdldFIodCkgKiBNYXRoLnNpbih0aGlzLmdldFAodCkpO1xyXG5cclxuXHRcdHJldHVybiAoMSAtIHQpICogdGhpcy5heSArIHQgKiB0aGlzLmJ5O1xyXG5cdH1cclxuXHJcblx0Z2V0Wih0KVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLnBhdGggPT0gJ3NwaGVyaWNhbCcpXHJcblx0XHRcdHJldHVybiB0aGlzLmN6ICsgdGhpcy5nZXRSKHQpICogTWF0aC5jb3ModGhpcy5nZXRUKHQpKTtcclxuXHJcblx0XHRyZXR1cm4gKDEgLSB0KSAqIHRoaXMuYXogKyB0ICogdGhpcy5iejtcclxuXHR9XHJcblxyXG5cdGdldFIodClcclxuXHR7XHJcblx0XHRyZXR1cm4gKDEgLSB0KSAqIHRoaXMuYXIgKyB0ICogdGhpcy5icjtcclxuXHR9XHJcblxyXG5cdGdldFAodClcclxuXHR7XHJcblx0XHRyZXR1cm4gKDEgLSB0KSAqIHRoaXMuYXAgKyB0ICogdGhpcy5icDtcclxuXHR9XHJcblxyXG5cdGdldFQodClcclxuXHR7XHJcblx0XHRyZXR1cm4gKDEgLSB0KSAqIHRoaXMuYXQgKyB0ICogdGhpcy5idDtcclxuXHR9XHJcbn0iLCJpbXBvcnQgVHJheWVjdG9yaWEgZnJvbSAnLi9UcmF5ZWN0b3JpYS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmF5ZWN0b3JpYUxpbmVhbCBleHRlbmRzIFRyYXllY3RvcmlhXHJcbntcclxuXHRjb25zdHJ1Y3RvcihzdGFydCwgZW5kKVxyXG5cdHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5heCA9IHN0YXJ0Lng7XHJcblx0XHR0aGlzLmF5ID0gc3RhcnQueTtcclxuXHRcdHRoaXMuYXogPSBzdGFydC56O1xyXG5cclxuXHRcdHRoaXMuZHggPSBlbmQueCAtIHN0YXJ0Lng7XHJcblx0XHR0aGlzLmR5ID0gZW5kLnkgLSBzdGFydC55O1xyXG5cdFx0dGhpcy5keiA9IGVuZC56IC0gc3RhcnQuejtcclxuXHJcblx0XHRzdGFydCA9IG51bGw7XHJcblx0XHRlbmQgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0Z2V0WCh0KVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLmF4ICsgdCAqIHRoaXMuZHg7XHJcblx0fVxyXG5cclxuXHRnZXRZKHQpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuYXkgKyB0ICogdGhpcy5keTtcclxuXHR9XHJcblxyXG5cdGdldFoodClcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5heiArIHQgKiB0aGlzLmR6O1xyXG5cdH1cclxufSIsImltcG9ydCBDaGFyYWN0ZXIgZnJvbSAnLi9DaGFyYWN0ZXIuanMnO1xyXG5cclxuaW1wb3J0IERpc2N1c3Npb25TdGFnZSBmcm9tICcuL0Rpc2N1c3Npb25TdGFnZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmlhbFxyXG57XHJcblx0Y29uc3RydWN0b3Iod2lkdGgsIGhlaWdodClcclxuXHR7XHJcblx0XHR0aGlzLlcgPSB3aWR0aDtcclxuXHRcdHRoaXMuSCA9IGhlaWdodDtcclxuXHJcblx0XHR0aGlzLmNoYXJhY3RlcnMgPSB7fTtcclxuXHRcdHRoaXMucmVuZGVyZXIgPSB7fTtcclxuXHJcblx0XHR0aGlzLnN0YWdlID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdHNldHVwUmVuZGVyZXIodHlwZSwgcmVuZGVyZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5yZW5kZXJlclt0eXBlXSA9IHJlbmRlcmVyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzZXROYXJyYXRvcihuYW1ldGFnKVxyXG5cdHtcclxuXHRcdHRoaXMuY2hhcmFjdGVycy5uYXJyYXRvciA9IG5ldyBDaGFyYWN0ZXIoe1xyXG5cdFx0XHRpZDogQ2hhcmFjdGVyLk5BUlJBVE9SLFxyXG5cdFx0XHRuYW1lOiBuYW1ldGFnXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNldENoYXJhY3RlcihjaGFyYWN0ZXIsIHBvc2l0aW9uKVxyXG5cdHtcclxuXHRcdGlmICghY2hhcmFjdGVyKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0Y2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihjaGFyYWN0ZXIpO1xyXG5cdFx0dGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3Rlci5pZF0gPSBjaGFyYWN0ZXI7XHJcblxyXG5cdFx0dGhpcy5yZW5kZXJlci5zY2VuZS5sb2NhdGVDaGFyYWN0ZXIoY2hhcmFjdGVyLCBwb3NpdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdXRUaGVGdWNraW5nQmVhcigpXHJcblx0e1xyXG5cdFx0bGV0IGt1bWEgPSBuZXcgQ2hhcmFjdGVyKHtcclxuXHRcdFx0aWQ6ICdtb25va3VtYScsXHJcblx0XHRcdG5hbWU6ICdNb25va3VtYSdcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5jaGFyYWN0ZXJzLm1vbm9rdW1hID0ga3VtYTtcclxuXHJcblx0XHR0aGlzLnJlbmRlcmVyLnNjZW5lLmhlSXNIZXJlKGt1bWEpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlU3RhZ2UobW9kZSlcclxuXHR7XHJcblx0XHRzd2l0Y2ggKG1vZGUpXHJcblx0XHR7XHJcblx0XHRcdGNhc2UgJ2Rpc2N1c3Npb24nOlxyXG5cdFx0XHRcdHRoaXMuc3RhZ2UgPSBuZXcgRGlzY3Vzc2lvblN0YWdlKHRoaXMpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Ly8gY2FzZSAnbnNkJzpcclxuXHRcdFx0Ly8gXHR0aGlzLnN0YWdlID0gbmV3IE5TRFN0YWdlKHRoaXMpO1xyXG5cdFx0XHQvLyBcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZFNjcmlwdCh1cmwpXHJcblx0e1xyXG5cdFx0ZmV0Y2godXJsKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlcy5qc29uKCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChzY3JpcHQpIHtcclxuXHRcdFx0XHRzY3JpcHQuZm9yRWFjaCh0aGlzLnBhcnNlU2NyaXB0LCB0aGlzKTtcclxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcclxuXHR9XHJcblxyXG5cdHBhcnNlU2NyaXB0KGJsb2NrKVxyXG5cdHtcclxuXHRcdGlmIChibG9jay5raW5kKSB7XHJcblx0XHRcdHRoaXMuc3RhZ2UuZW5kKGJsb2NrKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChibG9jay5zcGVha2VyID09ICduYXJyYXRvcicpIHtcclxuXHRcdFx0XHR0aGlzLnN0YWdlLnF1ZXVlTmFycmF0b3JTY3JpcHQoYmxvY2spO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuc3RhZ2UucXVldWVDaGFyYWN0ZXJTY3JpcHQoYmxvY2spO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59IiwiaW1wb3J0IENvb3JkZW5hZGEgZnJvbSAnLi9Db29yZGVuYWRhLmpzJztcclxuXHJcbmltcG9ydCBUcmF5ZWN0b3JpYUxpbmVhbCBmcm9tICcuL1RyYXllY3RvcmlhTGluZWFsLmpzJztcclxuaW1wb3J0IFRyYXllY3RvcmlhQ2lyY3VsYXIgZnJvbSAnLi9UcmF5ZWN0b3JpYUNpcmN1bGFyLmpzJztcclxuaW1wb3J0IFRyYXllY3RvcmlhRXNmZXJpY2EgZnJvbSAnLi9UcmF5ZWN0b3JpYUVzZmVyaWNhLmpzJztcclxuXHJcbmltcG9ydCBFQVNFIGZyb20gJy4vZWFzaW5nLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZGVvZ3JhcGhlclxyXG57XHJcblx0Y29uc3RydWN0b3IoZHVyYXRpb24sIHBhdGgsIGVhc2luZylcclxuXHR7XHJcblx0XHR0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHR0aGlzLnBhdGggPSBwYXRoIHx8ICdsaW5lYXInO1xyXG5cdFx0dGhpcy5lYXNpbmcgPSBlYXNpbmcgfHwgJ2xpbmVhcic7XHJcblx0fVxyXG5cclxuXHRnZXRQb3NpdGlvbih0aW1lKVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLnBvc2l0aW9uLmdldFZlY3RvciggdGhpcy5wb3NpdGlvbi5lYXNpbmcodGltZSkgKTtcclxuXHR9XHJcblxyXG5cdGdldERpcmVjdGlvbih0aW1lKVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLmRpcmVjdGlvbi5nZXRWZWN0b3IoIHRoaXMuZGlyZWN0aW9uLmVhc2luZyh0aW1lKSApO1xyXG5cdH1cclxuXHJcblx0Z2V0Rk9WKHRpbWUpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuZm92LnN0YXJ0ICsgdGhpcy5mb3YuZGVsdGEgKiB0aGlzLmZvdi5lYXNpbmcodGltZSk7XHJcblx0fVxyXG5cclxuXHRnZXRVcCh0aW1lKVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLnVwLmdldFZlY3RvciggdGhpcy51cC5lYXNpbmcodGltZSkgKTtcclxuXHR9XHJcblxyXG5cdHNldHVwUG9zaXRpb24oc3RhcnQsIGVuZCwgcGFyYW1zKVxyXG5cdHtcclxuXHRcdHN3aXRjaCAocGFyYW1zLnBhdGggfHwgdGhpcy5wYXRoKVxyXG5cdFx0e1xyXG5cdFx0XHRjYXNlICdjaXJjdWxhcic6XHJcblx0XHRcdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUcmF5ZWN0b3JpYUNpcmN1bGFyKFxyXG5cdFx0XHRcdFx0Q29vcmRlbmFkYS5wYXJzZShzdGFydCksXHJcblx0XHRcdFx0XHRDb29yZGVuYWRhLnBhcnNlKGVuZCksXHJcblx0XHRcdFx0XHRwYXJhbXMuY2VudGVyXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSAnc3BoZXJpY2FsJzpcclxuXHRcdFx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFRyYXllY3RvcmlhRXNmZXJpY2EoXHJcblx0XHRcdFx0XHRDb29yZGVuYWRhLnBhcnNlKHN0YXJ0KSxcclxuXHRcdFx0XHRcdENvb3JkZW5hZGEucGFyc2UoZW5kKSxcclxuXHRcdFx0XHRcdHBhcmFtcy5jZW50ZXJcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdsaW5lYXInOlxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRoaXMucG9zaXRpb24gPSBuZXcgVHJheWVjdG9yaWFMaW5lYWwoXHJcblx0XHRcdFx0XHRDb29yZGVuYWRhLnBhcnNlKHN0YXJ0KSxcclxuXHRcdFx0XHRcdENvb3JkZW5hZGEucGFyc2UoZW5kKVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBvc2l0aW9uLmVhc2luZyA9IEVBU0VbcGFyYW1zLmVhc2luZyB8fCB0aGlzLmVhc2luZ107XHJcblxyXG5cdFx0cGFyYW1zID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdHNldHVwRGlyZWN0aW9uKHN0YXJ0LCBlbmQsIHBhcmFtcylcclxuXHR7XHJcblx0XHRzd2l0Y2ggKHBhcmFtcy5wYXRoIHx8IHRoaXMucGF0aClcclxuXHRcdHtcclxuXHRcdFx0Y2FzZSAnY2lyY3VsYXInOlxyXG5cdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gbmV3IFRyYXllY3RvcmlhQ2lyY3VsYXIoXHJcblx0XHRcdFx0XHRDb29yZGVuYWRhLnBhcnNlKHN0YXJ0KSxcclxuXHRcdFx0XHRcdENvb3JkZW5hZGEucGFyc2UoZW5kKSxcclxuXHRcdFx0XHRcdHBhcmFtcy5jZW50ZXJcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdzcGhlcmljYWwnOlxyXG5cdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gbmV3IFRyYXllY3RvcmlhRXNmZXJpY2EoXHJcblx0XHRcdFx0XHRDb29yZGVuYWRhLnBhcnNlKHN0YXJ0KSxcclxuXHRcdFx0XHRcdENvb3JkZW5hZGEucGFyc2UoZW5kKSxcclxuXHRcdFx0XHRcdHBhcmFtcy5jZW50ZXJcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdsaW5lYXInOlxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gbmV3IFRyYXllY3RvcmlhTGluZWFsKFxyXG5cdFx0XHRcdFx0Q29vcmRlbmFkYS5wYXJzZShzdGFydCksXHJcblx0XHRcdFx0XHRDb29yZGVuYWRhLnBhcnNlKGVuZClcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5kaXJlY3Rpb24uZWFzaW5nID0gRUFTRVtwYXJhbXMuZWFzaW5nIHx8IHRoaXMuZWFzaW5nXTtcclxuXHJcblx0XHRwYXJhbXMgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0c2V0dXBGT1Yoc3RhcnQsIGVuZCwgcGFyYW1zKVxyXG5cdHtcclxuXHRcdHRoaXMuZm92ID0ge1xyXG5cdFx0XHRzdGFydDogc3RhcnQsXHJcblx0XHRcdGRlbHRhOiBlbmQgLSBzdGFydCxcclxuXHRcdFx0ZWFzaW5nOiBFQVNFW3BhcmFtcy5lYXNpbmcgfHwgdGhpcy5lYXNpbmddXHJcblx0XHR9O1xyXG5cclxuXHRcdHBhcmFtcyA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRzZXR1cFVwKHN0YXJ0LCBlbmQsIHBhcmFtcylcclxuXHR7XHJcblx0XHRzd2l0Y2ggKHBhcmFtcy5wYXRoIHx8IHRoaXMucGF0aClcclxuXHRcdHtcclxuXHRcdFx0Y2FzZSAnY2lyY3VsYXInOlxyXG5cdFx0XHRcdHRoaXMudXAgPSBuZXcgVHJheWVjdG9yaWFDaXJjdWxhcihcclxuXHRcdFx0XHRcdENvb3JkZW5hZGEucGFyc2Uoc3RhcnQpLFxyXG5cdFx0XHRcdFx0Q29vcmRlbmFkYS5wYXJzZShlbmQpLFxyXG5cdFx0XHRcdFx0cGFyYW1zLmNlbnRlclxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgJ3NwaGVyaWNhbCc6XHJcblx0XHRcdFx0dGhpcy51cCA9IG5ldyBUcmF5ZWN0b3JpYUVzZmVyaWNhKFxyXG5cdFx0XHRcdFx0Q29vcmRlbmFkYS5wYXJzZShzdGFydCksXHJcblx0XHRcdFx0XHRDb29yZGVuYWRhLnBhcnNlKGVuZCksXHJcblx0XHRcdFx0XHRwYXJhbXMuY2VudGVyXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSAnbGluZWFyJzpcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aGlzLnVwID0gbmV3IFRyYXllY3RvcmlhTGluZWFsKFxyXG5cdFx0XHRcdFx0Q29vcmRlbmFkYS5wYXJzZShzdGFydCksXHJcblx0XHRcdFx0XHRDb29yZGVuYWRhLnBhcnNlKGVuZClcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cC5lYXNpbmcgPSBFQVNFW3BhcmFtcy5lYXNpbmcgfHwgdGhpcy5lYXNpbmddO1xyXG5cclxuXHRcdHBhcmFtcyA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRydW5TdGFnZShjYW1lcmEsIHRpbWUpXHJcblx0e1xyXG5cdFx0dGhpcy5mb3YgJiYgKGNhbWVyYS5mb3YgPSB0aGlzLmdldEZPVih0aW1lKSApICYmIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcblx0XHR0aGlzLnBvc2l0aW9uICYmIGNhbWVyYS5wb3NpdGlvbi5jb3B5KCB0aGlzLmdldFBvc2l0aW9uKHRpbWUpICk7XHJcblx0XHR0aGlzLnVwICYmIGNhbWVyYS51cC5jb3B5KCB0aGlzLmdldFVwKHRpbWUpICk7XHJcblx0XHQvLyBkaXJlY3Rpb24gTVVTVCBiZSB0aGUgbGFzdCBwcm9wZXJ0eSB0byBjaGFuZ2VcclxuXHRcdHRoaXMuZGlyZWN0aW9uICYmIGNhbWVyYS5sb29rQXQoIHRoaXMuZ2V0RGlyZWN0aW9uKHRpbWUpICk7XHJcblx0fVxyXG5cclxuXHRkZWx0YShub3cpXHJcblx0e1xyXG5cdFx0dGhpcy5zdGFydCB8fCAodGhpcy5zdGFydCA9IG5vdyk7XHJcblx0XHRyZXR1cm4gKG5vdyAtIHRoaXMuc3RhcnQpIC8gdGhpcy5kdXJhdGlvbjtcclxuXHR9XHJcbn0iLCJpbXBvcnQgQ29vcmRlbmFkYSBmcm9tICcuLy4uL0Nvb3JkZW5hZGEuanMnO1xyXG5pbXBvcnQgVHJheWVjdG9yaWEgZnJvbSAnLi8uLi9UcmF5ZWN0b3JpYS5qcyc7XHJcbmltcG9ydCBBbmltYXRpb24gZnJvbSAnLi8uLi9BbmltYXRpb24uanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzY3Vzc2lvbkFuaW1hdGlvbiBleHRlbmRzIEFuaW1hdGlvblxyXG57XHJcblx0Y29uc3RydWN0b3IocmVuZGVyZXJzKVxyXG5cdHtcclxuXHRcdHN1cGVyKHJlbmRlcmVycyk7XHJcblx0fVxyXG5cclxuXHRyYW5kb21EaWFsb2d1ZSgpXHJcblx0e1xyXG5cdFx0dmFyIHRyYW5zaXRpb24sXHJcblx0XHRcdGluaWNpbyxcclxuXHRcdFx0ZGlyX3gsIGRpcl95LFxyXG5cdFx0XHRjaGFyID0ganVpY2lvLmNoYXJhY3RlcnNbT2JqZWN0LmtleXMoanVpY2lvLmNoYXJhY3RlcnMpW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE1KV1dLFxyXG5cdFx0XHRjb3VudGVyID0gY2hhci5jYXJkLmNvdW50ZXI7XHJcblxyXG5cdFx0c2NyZWVuLnNldERpYWxvZ3VlKGNoYXIsICdJIGFjdHVhbGx5IGxvb2tlZCBhdCB0aGUgY3JpbWUgc2NlbmUgZm9yIG1vcmUgdGhhbiAyIHNlY29uZHMsIHNvbWV0aGluZyB5b3Ugc2hvdWxkIHRyeSB0byBkbyBzb21ldGltZXMuLi4nKTtcclxuXHJcblx0XHRqdWljaW8ubWFpbkNhbWVyYS51cC54ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpIC8gMjtcclxuXHRcdGp1aWNpby5tYWluQ2FtZXJhLnVwLnogPSA1O1xyXG5cdFx0anVpY2lvLm1haW5DYW1lcmEudXAubm9ybWFsaXplKCk7XHJcblxyXG5cdFx0ZGlyX3ggPSAwLjUgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSk7XHJcblx0XHRkaXJfeSA9IDEwICogKE1hdGgucmFuZG9tKCkgLSAwLjUpO1xyXG5cclxuXHRcdHRyYW5zaXRpb24gPSBmdW5jdGlvbiAodCkge1xyXG5cdFx0XHR2YXIgZGVsdGEgPSAodCAtIGluaWNpbykgLyAxMDAwMCxcclxuXHRcdFx0XHRhbmcgPSAyICogTWF0aC5QSSAqIChjb3VudGVyICsgZGlyX3ggKiBkZWx0YSkgLyAxNjtcclxuXHJcblx0XHRcdGp1aWNpby5tYWluQ2FtZXJhLnBvc2l0aW9uLnNldChcclxuXHRcdFx0XHQoOSArIGRpcl95ICogZGVsdGEpICogTWF0aC5jb3MoYW5nKSxcclxuXHRcdFx0XHQoOSArIGRpcl95ICogZGVsdGEpICogTWF0aC5zaW4oYW5nKSxcclxuXHRcdFx0XHQxNlxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRqdWljaW8ubWFpbkNhbWVyYS5sb29rQXQoe1xyXG5cdFx0XHRcdHg6IDI1ICogTWF0aC5jb3MoYW5nKSxcclxuXHRcdFx0XHR5OiAyNSAqIE1hdGguc2luKGFuZyksXHJcblx0XHRcdFx0ejogMTZcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRqdWljaW8ucmVuZGVyKHQpO1xyXG5cdFx0XHRBbmltYXRpb24uc3RlcCh0cmFuc2l0aW9uKTtcclxuXHRcdH1cclxuXHJcblx0XHRqdWljaW8uYW5pbWF0aW9uLnN0b3AoKTtcclxuXHRcdGluaWNpbyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSArIDUwMDA7XHJcblx0XHRBbmltYXRpb24uc3RlcCh0cmFuc2l0aW9uKTtcclxuXHR9XHJcblxyXG5cdHR1dG9yaWFsKClcclxuXHR7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGVuZCkge1xyXG5cdFx0XHR0aGlzLm1haW5DYW1lcmEudXAuc2V0KDAsIDAsIDEpO1xyXG5cdFx0XHR0aGlzLm1haW5DYW1lcmEuZm92ID0gNDA7XHJcblx0XHRcdHRoaXMubWFpbkNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcblxyXG5cdFx0XHR0aGlzLnByb2Nlc3NvciA9IGZ1bmN0aW9uIChub3cpIHtcclxuXHRcdFx0XHRsZXQgYW5nbGUgPSAyICogTWF0aC5QSSAqIChub3cgJSA2MDAwMCkgLyA2MDAwMDtcclxuXHJcblx0XHRcdFx0Ly8gcG9zOiAyOCwgMCwgMzNcclxuXHRcdFx0XHR0aGlzLm1haW5DYW1lcmEucG9zaXRpb24uc2V0KC0yOCAqIE1hdGguY29zKGFuZ2xlKSwgLTI4ICogTWF0aC5zaW4oYW5nbGUpLCAzMyk7XHJcblx0XHRcdFx0Ly8gbG9vazogLTE5LCAwLCA5XHJcblx0XHRcdFx0dGhpcy5tYWluQ2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygxOSAqIE1hdGguY29zKGFuZ2xlKSwgMTkgKiBNYXRoLnNpbihhbmdsZSksIDkpKTtcclxuXHRcdFx0fTtcclxuXHRcdH0uYmluZCh0aGlzLnNjZW5lKSk7XHJcblx0fVxyXG5cclxuXHRjdWVzdGlvbmFtaWVudG8ocGFyYW0pXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuY3V0VG8oe1xyXG5cdFx0XHRmb3Y6IDQwLFxyXG5cdFx0XHR1cDogbmV3IENvb3JkZW5hZGEoMCwgMCwgMSksXHJcblx0XHRcdHBvc2l0aW9uOiBDb29yZGVuYWRhLnBhcnNlKHsgcjogMTAsIHA6IHBhcmFtLmF6aW11dGgsIHo6IDE3IH0pLFxyXG5cdFx0XHRkaXJlY3Rpb246IENvb3JkZW5hZGEucGFyc2UoeyByOiAyNiwgcDogcGFyYW0uYXppbXV0aCwgejogMTUgfSlcclxuXHRcdH0pXHJcblx0XHQudGhlbihmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMudHJhbnNpY2lvbih7XHJcblx0XHRcdFx0Zm92OiA1NCxcclxuXHRcdFx0XHRkdXJhdGlvbjogKHBhcmFtLmR1cmF0aW9uIHx8IDYwMCkgKiA0IC8gNyxcclxuXHRcdFx0XHRwb3NpdGlvbjogQ29vcmRlbmFkYS5wYXJzZSh7IHI6IDMsIHA6IHBhcmFtLmF6aW11dGgsIHo6IDE2IH0pLFxyXG5cdFx0XHRcdGRpcmVjdGlvbjogQ29vcmRlbmFkYS5wYXJzZSh7IHI6IDI2LCBwOiBwYXJhbS5hemltdXRoLCB6OiAxNSB9KSxcclxuXHRcdFx0XHRlYXNpbmc6ICdvdXRRdWFkJ1xyXG5cdFx0XHR9KTtcclxuXHRcdH0uYmluZCh0aGlzKSlcclxuXHRcdC50aGVuKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy50cmFuc2ljaW9uKHtcclxuXHRcdFx0XHRmb3Y6IDYwLFxyXG5cdFx0XHRcdGR1cmF0aW9uOiAocGFyYW0uZHVyYXRpb24gfHwgNjAwKSAqIDMgLyA3LFxyXG5cdFx0XHRcdHBvc2l0aW9uOiBDb29yZGVuYWRhLnBhcnNlKHsgcjogMTAsIHA6IHBhcmFtLmF6aW11dGgsIHo6IDE3IH0pLFxyXG5cdFx0XHRcdGRpcmVjdGlvbjogQ29vcmRlbmFkYS5wYXJzZSh7IHI6IDI2LCBwOiBwYXJhbS5hemltdXRoLCB6OiAxNSB9KSxcclxuXHRcdFx0XHRlYXNpbmc6ICdpbkN1YmljJ1xyXG5cdFx0XHR9KTtcclxuXHRcdH0uYmluZCh0aGlzKSk7XHJcblx0fVxyXG5cclxuXHRleGl0U3BpbigpXHJcblx0e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChlbmQpIHtcclxuXHRcdFx0dmFyIGluaWNpbyxcclxuXHRcdFx0XHRpbml0aWFsX3VwID0gQ29vcmRlbmFkYS5wYXJzZSh0aGlzLnNjZW5lLm1haW5DYW1lcmEudXApLFxyXG5cdFx0XHRcdGluaXRpYWxfcG9zID0gQ29vcmRlbmFkYS5wYXJzZSh0aGlzLnNjZW5lLm1haW5DYW1lcmEucG9zaXRpb24pLFxyXG5cdFx0XHRcdGluaXRpYWxfbG9vayA9IENvb3JkZW5hZGEucGFyc2UobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEwKS5hcHBseU1hdHJpeDQodGhpcy5zY2VuZS5tYWluQ2FtZXJhLm1hdHJpeFdvcmxkKSksXHJcblx0XHRcdFx0dXAgPSB7XHJcblx0XHRcdFx0XHRyOiBpbml0aWFsX3VwLnIsXHJcblx0XHRcdFx0XHRkcDogaW5pdGlhbF91cC5wIC0gaW5pdGlhbF9wb3MucCxcclxuXHRcdFx0XHRcdHo6IGluaXRpYWxfdXAuelxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bG9vayA9IHtcclxuXHRcdFx0XHRcdHI6IGluaXRpYWxfbG9vay5yLFxyXG5cdFx0XHRcdFx0ZHA6IGluaXRpYWxfbG9vay5wIC0gaW5pdGlhbF9wb3MucCxcclxuXHRcdFx0XHRcdHo6IGluaXRpYWxfbG9vay56XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdGluaXRpYWxfbG9vayA9IG51bGw7XHJcblx0XHRcdGluaXRpYWxfdXAgPSBudWxsO1xyXG5cclxuXHRcdFx0dGhpcy5odWQucHJvY2Vzc29yID0gZnVuY3Rpb24gKG5vdykge1xyXG5cdFx0XHRcdGxldCBkZWx0YSA9IChub3cgLSBpbmljaW8pIC8gMTAwMDtcclxuXHJcblx0XHRcdFx0aWYgKGRlbHRhID49IDIpIHtcclxuXHRcdFx0XHRcdHRoaXMucHJvY2Vzc29yID0gbnVsbDtcclxuXHRcdFx0XHRcdGVuZCgpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZGVsdGEgPiAxKVxyXG5cdFx0XHRcdFx0dGhpcy5ibGFja1NjcmVlbiA9IGRlbHRhIC0gMTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR0aGlzLmJsYWNrU2NyZWVuID0gMDtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuc2NlbmUucHJvY2Vzc29yID0gZnVuY3Rpb24gKG5vdykge1xyXG5cdFx0XHRcdGluaWNpbyB8fCAoaW5pY2lvID0gbm93KTtcclxuXHJcblx0XHRcdFx0bGV0IGRlbHRhID0gKG5vdyAtIGluaWNpbykgLyAxMDAwLFxyXG5cdFx0XHRcdFx0YW5nbGUgPSBpbml0aWFsX3Bvcy5wIC0gKGRlbHRhICogTWF0aC5QSSk7XHJcblxyXG5cdFx0XHRcdHRoaXMubWFpbkNhbWVyYS5wb3NpdGlvbi5zZXQoXHJcblx0XHRcdFx0XHRpbml0aWFsX3Bvcy5yICogTWF0aC5jb3MoYW5nbGUpLFxyXG5cdFx0XHRcdFx0aW5pdGlhbF9wb3MuciAqIE1hdGguc2luKGFuZ2xlKSxcclxuXHRcdFx0XHRcdGluaXRpYWxfcG9zLnogKiAoMSAtIGRlbHRhIC8gMikgKyAxOSAqIGRlbHRhIC8gMlxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR0aGlzLm1haW5DYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKFxyXG5cdFx0XHRcdFx0bG9vay5yICogTWF0aC5jb3MoYW5nbGUgKyBsb29rLmRwKSxcclxuXHRcdFx0XHRcdGxvb2suciAqIE1hdGguc2luKGFuZ2xlICsgbG9vay5kcCksXHJcblx0XHRcdFx0XHRsb29rLnogKiAoMSAtIGRlbHRhIC8gMikgKyAxOSAqIGRlbHRhIC8gMlxyXG5cdFx0XHRcdFx0KSk7XHJcblx0XHRcdFx0dGhpcy5tYWluQ2FtZXJhLnVwLnNldChcclxuXHRcdFx0XHRcdHVwLnIgKiBNYXRoLmNvcyhhbmdsZSArIHVwLmRwKSxcclxuXHRcdFx0XHRcdHVwLnIgKiBNYXRoLnNpbihhbmdsZSArIHVwLmRwKSxcclxuXHRcdFx0XHRcdHVwLnpcclxuXHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdGlmIChkZWx0YSA+PSAyKSB7XHJcblx0XHRcdFx0XHRpbmljaW8gPSBudWxsO1xyXG5cdFx0XHRcdFx0aW5pdGlhbF9wb3MgPSBudWxsO1xyXG5cdFx0XHRcdFx0dGhpcy5wcm9jZXNzb3IgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH0uYmluZCh0aGlzKSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgLy8gdDogc3RhcnQgdGltZSwgYjogYmVnSW5uSW5nIHZhbHVlLCBjOiBjaGFuZ2UgSW4gdmFsdWUsIGQ6IGR1cmF0aW9uXHJcblx0bm9uZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gMTtcclxuXHR9LFxyXG4gICAgbGluZWFyOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgfSxcclxuICAgIGluUXVhZDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCAqIHg7XHJcbiAgICB9LFxyXG4gICAgb3V0UXVhZDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gLXggKiAoeCAtIDIpO1xyXG4gICAgfSxcclxuICAgIGluT3V0UXVhZDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMC41ICogKCh4ICo9IDIpIDwgMSA/IHggKiB4IDogeCAqICgyIC0geCkgLSAyKTtcclxuICAgIH0sXHJcbiAgICBpbkN1YmljOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ICogeCAqIHg7XHJcbiAgICB9LFxyXG4gICAgb3V0Q3ViaWM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHggLSAxLCAzKSArIDE7XHJcbiAgICB9LFxyXG4gICAgaW5PdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMC41ICogKCh4ICo9IDIpIDwgMSA/IHggKiB4ICogeCA6IE1hdGgucG93KDIgKiB4IC0gMiwgMykgKyAyKTtcclxuICAgIH0sLypcclxuICAgIGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBjICogKHQgLz0gZCkgKiB0ICogdCAqIHQ7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAtYyAqICgodCA9IHQgLyBkIC0gMSkgKiB0ICogdCAqIHQgLSAxKTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBpZiAoKHQgLz0gZCAvIDIpIDwgMSlcclxuICAgICAgICAgICAgcmV0dXJuIGMgLyAyICogdCAqIHQgKiB0ICogdDtcclxuICAgICAgICByZXR1cm4gLWMgLyAyICogKCh0IC09IDIpICogdCAqIHQgKiB0IC0gMik7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIGMgKiAodCAvPSBkKSAqIHQgKiB0ICogdCAqIHQ7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dFF1aW50OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBjICogKCh0ID0gdCAvIGQgLSAxKSAqIHQgKiB0ICogdCAqIHQgKyAxKTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBpZiAoKHQgLz0gZCAvIDIpIDwgMSlcclxuICAgICAgICAgICAgcmV0dXJuIGMgLyAyICogdCAqIHQgKiB0ICogdCAqIHQ7XHJcbiAgICAgICAgcmV0dXJuIGMgLyAyICogKCh0IC09IDIpICogdCAqIHQgKiB0ICogdCArIDIpO1xyXG4gICAgfSwqL1xyXG4gICAgaW5TaW5lOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5jb3MoeCAqIE1hdGguUEkgLyAyKTtcclxuICAgIH0sXHJcbiAgICBvdXRTaW5lOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNpbih4ICogTWF0aC5QSSAvIDIpO1xyXG4gICAgfSxcclxuICAgIGluT3V0U2luZTogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogeCkgLSAxKTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5FeHBvOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnBvdygxMDI0LCB4IC0gMSk7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dEV4cG86IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEuMDAwOTc2NTYyNiAtIE1hdGgucG93KDEwMjQsIC14KTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAwLjUgKiAoKHggKj0gMikgPCAxID8gTWF0aC5wb3coMTAyNCwgeCAtIDEpIDogMiAtIE1hdGgucG93KDEwMjQsIDEgLSB4KSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZVNjcmVlbiBmcm9tICcuL1NjcmVlbi5qcyc7XHJcbmltcG9ydCBUZXh0RWxlbWVudCBmcm9tICcuL1RleHRFbGVtZW50LmpzJ1xyXG5cclxuaW1wb3J0IHsgTkFSUkFUT1IgfSBmcm9tICcuLy4uL0NoYXJhY3Rlci5qcyc7XHJcblxyXG5jbGFzcyBEaXNjdXNzaW9uU2NyZWVuIGV4dGVuZHMgQmFzZVNjcmVlblxyXG57XHJcblx0Y29uc3RydWN0b3IoY3R4KVxyXG5cdHtcclxuXHRcdHN1cGVyKGN0eCk7XHJcblxyXG5cdFx0dGhpcy5ncmFkaWVudHMgPSAoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgd2lkdGggPSBjdHguY2FudmFzLndpZHRoLFxyXG5cdFx0XHRcdHByb3RhZ0Rpc2NMZWZ0ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHdpZHRoLCAwKSxcclxuXHRcdFx0XHRsYWJlbERpc2NMZWZ0ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHdpZHRoLCAwKSxcclxuXHRcdFx0XHRsYWJlbERpc2NSaWdodCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCB3aWR0aCwgMCk7XHJcblxyXG5cdFx0XHRwcm90YWdEaXNjTGVmdC5hZGRDb2xvclN0b3AoMCwgJyNDQzAwMDAnKTtcclxuXHRcdFx0cHJvdGFnRGlzY0xlZnQuYWRkQ29sb3JTdG9wKDAuNjUsICdyZ2IoMjU1LCA1MSwgNTEpJyk7XHJcblx0XHRcdHByb3RhZ0Rpc2NMZWZ0LmFkZENvbG9yU3RvcCgwLjc1LCAncmdiYSgyNTUsIDUxLCA1MSwgMCknKTtcclxuXHJcblx0XHRcdGxhYmVsRGlzY0xlZnQuYWRkQ29sb3JTdG9wKDAuNjUsICdyZ2IoMjU1LCA1MSwgNTEpJyk7XHJcblx0XHRcdGxhYmVsRGlzY0xlZnQuYWRkQ29sb3JTdG9wKDAuNzUsICdyZ2JhKDI1NSwgNTEsIDUxLCAwKScpO1xyXG5cclxuXHRcdFx0bGFiZWxEaXNjUmlnaHQuYWRkQ29sb3JTdG9wKDAuNjUsICdyZ2IoMjU1LCA1MSwgNTEpJyk7XHJcblx0XHRcdGxhYmVsRGlzY1JpZ2h0LmFkZENvbG9yU3RvcCgwLjc1LCAncmdiYSgyNTUsIDUxLCA1MSwgMCknKTtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bmFtZXByb3RhZ0xlZnQ6IHByb3RhZ0Rpc2NMZWZ0LFxyXG5cdFx0XHRcdG5hbWV0YWdMZWZ0OiBsYWJlbERpc2NMZWZ0LFxyXG5cdFx0XHRcdG5hbWV0YWdSaWdodDogbGFiZWxEaXNjUmlnaHRcclxuXHRcdFx0fTtcclxuXHRcdH0pKCk7XHJcblxyXG5cdFx0dGhpcy5jYXNlTnVtYmVyID0gJzAyJztcclxuXHJcblx0XHR0aGlzLmJhbm5lcl94ID0gMDtcclxuXHJcblx0XHR0aGlzLnNwZWFrZXJDYXJkVGltZXIgPSAwO1xyXG5cdFx0dGhpcy5zcGVha2VyQ2FyZEltYWdlID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLnNwZWFrZXJDYXJkSW1hZ2Uuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQVAvLy93QUFBQ0g1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlDUkFFQU93PT0nO1xyXG5cclxuXHRcdHRoaXMuZGlhbG9ndWUgPSBuZXcgVGV4dEVsZW1lbnQoY3R4KTtcclxuXHRcdHRoaXMuZGlhbG9ndWUueCA9IDAuMDUgKiB0aGlzLlc7XHJcblx0XHR0aGlzLmRpYWxvZ3VlLnkgPSAwLjggKiB0aGlzLkg7XHJcblx0XHR0aGlzLmRpYWxvZ3VlLnR5cGV3cml0ZSA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5uYW1ldGFnID0gbmV3IFRleHRFbGVtZW50KGN0eCk7XHJcblx0XHR0aGlzLm5hbWV0YWcueCA9IDAuMDMgKiB0aGlzLlc7XHJcblx0XHR0aGlzLm5hbWV0YWcueSA9IDAuNjc1ICogdGhpcy5IO1xyXG5cdFx0dGhpcy5uYW1ldGFnLmZvbnQgPSAoMC4wNCAqIHRoaXMuSCkgKyAncHggQWVybywgc2Fucy1zZXJpZic7XHJcblxyXG5cdFx0dGhpcy5hZGQodGhpcy5kaWFsb2d1ZSwgdGhpcy5uYW1ldGFnKTtcclxuXHR9XHJcblxyXG5cdHNldERpYWxvZ3VlKHNwZWFrZXIsIHRleHQsIHRob3VnaHQpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuc3BlYWtlcklkICE9IHNwZWFrZXIuaWQpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuZ2VuZXJhdGVJbnRlcmZlcmVuY2VQYXR0ZXJuKCk7XHJcblx0XHRcdHRoaXMuaW50ZXJmZXJlbmNlT3BhY2l0eSA9IDE7XHJcblxyXG5cdFx0XHR0aGlzLm5hbWV0YWcubWFyZ2luTGVmdCA9IDAuMDQgKiB0aGlzLlc7XHJcblx0XHRcdHRoaXMubmFtZXRhZy5vcGFjaXR5ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNwZWFrZXJJZCA9IHNwZWFrZXIuaWQ7XHJcblx0XHR0aGlzLnNwZWFrZXJJc1Byb3RhZ29uaXN0ID0gKHNwZWFrZXIuY2FyZCAmJiBzcGVha2VyLmNhcmQuY291bnRlciA9PSAwKTtcclxuXHRcdHRoaXMuc3BlYWtlckNhcmRJbWFnZS5zcmMgPSBzcGVha2VyLmJ1c3RTcHJpdGVVcmk7XHJcblxyXG5cdFx0dGhpcy5uYW1ldGFnLnRleHQgPSBzcGVha2VyLm5hbWUuc3BsaXQoXCJcIikuam9pbihTdHJpbmcuZnJvbUNoYXJDb2RlKDgyMDIpKTtcclxuXHJcblx0XHR0aGlzLmRpYWxvZ3VlLnRleHQgPSB0ZXh0O1xyXG5cdFx0dGhpcy5kaWFsb2d1ZS50eXBld0xlbmd0aCA9IDA7XHJcblxyXG5cdFx0aWYgKHRob3VnaHQpXHJcblx0XHRcdHRoaXMuZGlhbG9ndWUuY29sb3IgPSB0aGlzLmNvbnN0cnVjdG9yLkNPTE9SX1RIT1VHSFQ7XHJcblx0XHRlbHNlIGlmIChzcGVha2VyLmlkID09IE5BUlJBVE9SKVxyXG5cdFx0XHR0aGlzLmRpYWxvZ3VlLmNvbG9yID0gdGhpcy5jb25zdHJ1Y3Rvci5DT0xPUl9OQVJSQVRPUjtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy5kaWFsb2d1ZS5jb2xvciA9IHRoaXMuY29uc3RydWN0b3IuQ09MT1JfQ0hBUkFDVEVSO1xyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVJbnRlcmZlcmVuY2VQYXR0ZXJuKClcclxuXHR7XHJcblx0XHR0aGlzLmludGVyZmVyZW5jZVBhdHRlcm4gPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLjA4ICogdGhpcy5ILCAwLCAwLjYzICogdGhpcy5IKTtcclxuXHJcblx0XHR2YXIgbixcclxuXHRcdFx0Z3VpZGVhID0gJzAnLFxyXG5cdFx0XHRndWlkZWIgPSAnMCcsXHJcblx0XHRcdHkgPSBNYXRoLmZsb29yKHRoaXMuSCAvIDEwMCk7XHJcblxyXG5cdFx0d2hpbGUgKHktLSlcclxuXHRcdHtcclxuXHRcdFx0Z3VpZGVhICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkudG9TdHJpbmcoMik7XHJcblx0XHRcdGd1aWRlYiArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDApLnRvU3RyaW5nKDIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG4gPSAoeSA9IE1hdGgubWluKGd1aWRlYS5sZW5ndGgsIGd1aWRlYi5sZW5ndGgpKTtcclxuXHJcblx0XHR3aGlsZSAoeS0tKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoZ3VpZGVhW3ldICE9IGd1aWRlYlt5XSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuaW50ZXJmZXJlbmNlUGF0dGVybi5hZGRDb2xvclN0b3AoeSAvIG4gLSAwLjAwNSwgJyNmZjMzMzMnKTtcclxuXHRcdFx0XHR0aGlzLmludGVyZmVyZW5jZVBhdHRlcm4uYWRkQ29sb3JTdG9wKHkgLyBuLCAnI2ZmZmZmZicpO1xyXG5cdFx0XHRcdHRoaXMuaW50ZXJmZXJlbmNlUGF0dGVybi5hZGRDb2xvclN0b3AoeSAvIG4gKyAwLjAwNSwgJyNmZjMzMzMnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhd0NsYXNzVHJpYWxCYW5uZXIoKVxyXG5cdHtcclxuXHRcdHRoaXMuY3R4LnNhdmUoKTtcclxuXHJcblx0XHR0aGlzLmN0eC5mb250ID0gKDAuMDggKiB0aGlzLkgpICsgJ3B4IEdvb2RieWUgRGVzcGFpcic7XHJcblx0XHR0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDAuNTtcclxuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDI1NSwyNTUsMjU1LDAuNSknO1xyXG5cdFx0dGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xyXG5cdFx0dGhpcy5jdHgubGluZVdpZHRoID0gdGhpcy5IIC8gNTAwO1xyXG5cclxuXHRcdHZhciB3aWR0aCA9IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KCdjbGFzcyB0cmlhbCAnKS53aWR0aDtcclxuXHJcblx0XHR0aGlzLmN0eC5maWxsVGV4dCgnY2xhc3MgdHJpYWwgY2xhc3MgdHJpYWwgY2xhc3MgdHJpYWwgY2xhc3MgdHJpYWwgY2xhc3MgdHJpYWwgJywgdGhpcy5iYW5uZXJfeCwgMC4wNiAqIHRoaXMuSCk7XHJcblx0XHR0aGlzLmN0eC5zdHJva2VUZXh0KCdjbGFzcyB0cmlhbCBjbGFzcyB0cmlhbCBjbGFzcyB0cmlhbCBjbGFzcyB0cmlhbCBjbGFzcyB0cmlhbCAnLCB0aGlzLmJhbm5lcl94LCAwLjA2ICogdGhpcy5IKTtcclxuXHJcblx0XHR0aGlzLmJhbm5lcl94IC09IHRoaXMuVyAvIDEwMDA7XHJcblx0XHRpZiAodGhpcy5iYW5uZXJfeCA8IC13aWR0aClcclxuXHRcdFx0dGhpcy5iYW5uZXJfeCArPSB3aWR0aDtcclxuXHJcblx0XHR3aWR0aCA9IG51bGw7XHJcblxyXG5cdFx0dGhpcy5jdHgucmVzdG9yZSgpO1xyXG5cdH1cclxuXHJcblx0ZHJhd1NwZWFrZXJDYXJkKClcclxuXHR7XHJcblx0XHR2YXIgeSxcclxuXHRcdFx0d2lkdGggPSAwLjE5ICogdGhpcy5XO1xyXG5cclxuXHRcdHRoaXMuc3BlYWtlckNhcmRUaW1lciArPSAwLjAzO1xyXG5cclxuXHRcdGlmICh0aGlzLnNwZWFrZXJDYXJkVGltZXIgPj0gMSlcclxuXHRcdFx0dGhpcy5zcGVha2VyQ2FyZFRpbWVyID0gLTE7XHJcblxyXG5cdFx0dGhpcy5jdHguc2F2ZSgpO1xyXG5cclxuXHRcdC8vIEJsYWNrIGJhY2tncm91bmRcclxuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XHJcblx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgMC42MyAqIHRoaXMuSCk7XHJcblxyXG5cdFx0Ly8gXCJDQVNFXCIgYmFja2dyb3VuZCBwb2x5Z29uXHJcblx0XHR0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuXHRcdHRoaXMuY3R4Lm1vdmVUbygwLCAwKTtcclxuXHRcdHRoaXMuY3R4LmxpbmVUbygwLjEgKiB0aGlzLlcsIDApO1xyXG5cdFx0dGhpcy5jdHgubGluZVRvKDAuMSAqIHRoaXMuVyArIDAuMDcgKiB0aGlzLkgsIDAuMDcgKiB0aGlzLkgpO1xyXG5cdFx0dGhpcy5jdHgubGluZVRvKDAsIDAuMDcgKiB0aGlzLkgpO1xyXG5cdFx0dGhpcy5jdHguY2xvc2VQYXRoKCk7XHJcblxyXG5cdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gJyM5OTk5OTknO1xyXG5cdFx0dGhpcy5jdHguZmlsbCgpO1xyXG5cclxuXHRcdHRoaXMuY3R4LmZvbnQgPSAwLjA2ICogdGhpcy5IICsgJ3B4IEdvb2RieWUgRGVzcGFpcic7XHJcblxyXG5cdFx0Ly8gXCJDQVNFXCJcclxuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcclxuXHRcdHRoaXMuY3R4LmZpbGxUZXh0KCdjYXNlJywgMC4wMSAqIHRoaXMuVywgMC4wNTQgKiB0aGlzLkgpO1xyXG5cclxuXHRcdC8vIENhc2UgbnVtYmVyXHJcblx0XHR0aGlzLmN0eC50ZXh0QWxpZ24gPSAncmlnaHQnO1xyXG5cdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gJyNmZjMzMzMnO1xyXG5cdFx0dGhpcy5jdHguZmlsbFRleHQodGhpcy5jYXNlTnVtYmVyLCAwLjE5ICogdGhpcy5XIC0gMC4wMSAqIHRoaXMuSCwgMC4wNTQgKiB0aGlzLkgpO1xyXG5cclxuXHRcdHRoaXMuY3R4LnJlc3RvcmUoKTtcclxuXHJcblx0XHR0aGlzLmN0eC5zYXZlKCk7XHJcblxyXG5cdFx0dGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcblx0XHR0aGlzLmN0eC5yZWN0KDAsIDAuMDc1ICogdGhpcy5ILCB3aWR0aCAtIDAuMDA1ICogdGhpcy5ILCAwLjU1ICogdGhpcy5IKTtcclxuXHRcdHRoaXMuY3R4LmNsaXAoKTtcclxuXHJcblx0XHQvLyBDYXJkIGltYWdlIGJhY2tncm91bmQgZ3JhZGllbnRcclxuXHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxyXG5cdFx0XHQwLCAoMC4wOCAtIDEuMSArIDAuNTUgKiB0aGlzLnNwZWFrZXJDYXJkVGltZXIpICogdGhpcy5ILFxyXG5cdFx0XHQwLCAoMC4wOCArIDEuMSArIDAuNTUgKiB0aGlzLnNwZWFrZXJDYXJkVGltZXIpICogdGhpcy5IXHJcblx0XHRcdCk7XHJcblx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJyNGRjAwMDAnKTtcclxuXHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjI1LCAnIzAwMDAwMCcpO1xyXG5cdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNSwgJyNGRjAwMDAnKTtcclxuXHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjc1LCAnIzAwMDAwMCcpO1xyXG5cdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICcjRkYwMDAwJyk7XHJcblxyXG5cdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XHJcblx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgdGhpcy5IKTtcclxuXHJcblx0XHRncmFkaWVudCA9IG51bGw7XHJcblxyXG5cdFx0dGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnIycgKyAoJzAnICsgTWF0aC5mbG9vcihNYXRoLmFicyh0aGlzLnNwZWFrZXJDYXJkVGltZXIgKiAyNTUpKS50b1N0cmluZygxNikpLnNsaWNlKC0yKSArICcwMDAwJztcclxuXHRcdHRoaXMuY3R4LmxpbmVXaWR0aCA9IHRoaXMuSCAvIDIwMDtcclxuXHRcdC8vIENhcmQgaW1hZ2UgYmFja2dyb3VuZCBsaW5lIHBhdHRlcm5cclxuXHRcdHkgPSAwLjYyNSArIHdpZHRoIC8gdGhpcy5IO1xyXG5cdFx0d2hpbGUgKHkgPiAwLjA3NSlcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdHRoaXMuY3R4Lm1vdmVUbyh3aWR0aCAtIDAuMDAyNSAqIHRoaXMuSCwgeSAqIHRoaXMuSCk7XHJcblx0XHRcdHRoaXMuY3R4LmxpbmVUbygtMC4wMDI1ICogdGhpcy5ILCB5ICogdGhpcy5IIC0gd2lkdGgpO1xyXG5cdFx0XHR0aGlzLmN0eC5zdHJva2UoKTtcclxuXHRcdFx0eSAtPSAwLjAzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHkgPSAxLjYgKiAwLjU1ICogdGhpcy5IO1xyXG5cdFx0dGhpcy5jdHguZHJhd0ltYWdlKHRoaXMuc3BlYWtlckNhcmRJbWFnZSxcclxuXHRcdFx0KHdpZHRoIC0geSAvIHRoaXMuc3BlYWtlckNhcmRJbWFnZS5uYXR1cmFsSGVpZ2h0ICogdGhpcy5zcGVha2VyQ2FyZEltYWdlLm5hdHVyYWxXaWR0aCkgLyAyLFxyXG5cdFx0XHQwLjA3NSAqIHRoaXMuSCxcclxuXHRcdFx0eSAvIHRoaXMuc3BlYWtlckNhcmRJbWFnZS5uYXR1cmFsSGVpZ2h0ICogdGhpcy5zcGVha2VyQ2FyZEltYWdlLm5hdHVyYWxXaWR0aCxcclxuXHRcdFx0eVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdGlmICh0aGlzLmludGVyZmVyZW5jZU9wYWNpdHkgPiAwKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHRoaXMuaW50ZXJmZXJlbmNlT3BhY2l0eTtcclxuXHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5pbnRlcmZlcmVuY2VQYXR0ZXJuO1xyXG5cdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLjA3NSAqIHRoaXMuSCwgd2lkdGgsIDAuNTUgKiB0aGlzLkgpO1xyXG5cclxuXHRcdFx0dGhpcy5pbnRlcmZlcmVuY2VPcGFjaXR5IC09IDAuMDg7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jdHgucmVzdG9yZSgpO1xyXG5cclxuXHRcdHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJyNmZmZmZmYnO1xyXG5cdFx0dGhpcy5jdHgubGluZVdpZHRoID0gdGhpcy5IIC8gNTAwO1xyXG5cclxuXHRcdC8vIFdoaXRlIGxpbmUgbmV4dCB0byBjYXNlIG51bWJlclxyXG5cdFx0dGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcblx0XHR0aGlzLmN0eC5tb3ZlVG8od2lkdGggLSAwLjAwNSAqIHRoaXMuSCwgMCk7XHJcblx0XHR0aGlzLmN0eC5saW5lVG8od2lkdGggLSAwLjAwNSAqIHRoaXMuSCwgMC4wNyAqIHRoaXMuSCk7XHJcblx0XHR0aGlzLmN0eC5zdHJva2UoKTtcclxuXHJcblx0XHQvLyBXaGl0ZSBsaW5lIGFyb3VuZCBjYXJkIGltYWdlXHJcblx0XHR0aGlzLmN0eC5zdHJva2VSZWN0KC0wLjAwNSAqIHRoaXMuSCwgMC4wNzUgKiB0aGlzLkgsIHdpZHRoLCAwLjU1ICogdGhpcy5IKTtcclxuXHJcblx0XHR0aGlzLmN0eC5yZXN0b3JlKCk7XHJcblxyXG5cdFx0d2lkdGggPSBudWxsO1xyXG5cdH1cclxuXHJcblx0ZHJhd0RpYWxvZ0JhY2tncm91bmQoKVxyXG5cdHtcclxuXHRcdHRoaXMuY3R4LnNhdmUoKTtcclxuXHJcblx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjgpJztcclxuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIHRoaXMuSCAqIDAuNjksIHRoaXMuVywgdGhpcy5IICogMC4zMSk7XHJcblxyXG5cdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5ncmFkaWVudHNbdGhpcy5zcGVha2VySXNQcm90YWdvbmlzdCA/ICduYW1lcHJvdGFnTGVmdCcgOiAnbmFtZXRhZ0xlZnQnXTtcclxuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIHRoaXMuSCAqIDAuNjMsIHRoaXMuVywgdGhpcy5IICogMC4wNik7XHJcblxyXG5cdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIHRoaXMuSCAqIDAuNjkzLCB0aGlzLlcsIHRoaXMuSCAqIDAuMDIpO1xyXG5cclxuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjRkYwMDY2JztcclxuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIHRoaXMuSCAqIDAuNzEzLCB0aGlzLlcsIHRoaXMuSCAqIDAuMDEpO1xyXG5cclxuXHRcdHRoaXMuY3R4LnJlc3RvcmUoKTtcclxuXHR9XHJcblxyXG5cdGRyYXcodGltZSlcclxuXHR7XHJcblx0XHR0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5XLCB0aGlzLkgpO1xyXG5cclxuXHRcdHRoaXMuZHJhd0NsYXNzVHJpYWxCYW5uZXIoKTtcclxuXHRcdHRoaXMuZHJhd0RpYWxvZ0JhY2tncm91bmQoKTtcclxuXHJcblx0XHRpZiAodGhpcy5zcGVha2VySWQgIT0gTkFSUkFUT1IpXHJcblx0XHRcdHRoaXMuZHJhd1NwZWFrZXJDYXJkKCk7XHJcblxyXG5cdFx0dGhpcy5kaWFsb2d1ZS5kcmF3KCk7XHJcblxyXG5cdFx0aWYgKHRoaXMubmFtZXRhZy5tYXJnaW5MZWZ0ID4gMClcclxuXHRcdFx0dGhpcy5uYW1ldGFnLm1hcmdpbkxlZnQgLT0gMC4wMDUgKiB0aGlzLlc7XHJcblx0XHRpZiAodGhpcy5uYW1ldGFnLm9wYWNpdHkgPCAxKVxyXG5cdFx0XHR0aGlzLm5hbWV0YWcub3BhY2l0eSArPSAwLjE7XHJcblx0XHR0aGlzLm5hbWV0YWcuZHJhdygpO1xyXG5cdH1cclxufVxyXG5cclxuRGlzY3Vzc2lvblNjcmVlbi5DT0xPUl9OQVJSQVRPUiA9ICcjNDdGRjE5JztcclxuRGlzY3Vzc2lvblNjcmVlbi5DT0xPUl9DSEFSQUNURVIgPSAnd2hpdGUnO1xyXG5EaXNjdXNzaW9uU2NyZWVuLkNPTE9SX1RIT1VHSFQgPSAnIzVhYzNkOCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEaXNjdXNzaW9uU2NyZWVuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFVERWxlbWVudFxyXG57XHJcblx0Y29uc3RydWN0b3IoY3R4KVxyXG5cdHtcclxuXHRcdHRoaXMudHlwZSA9ICdIVUQuRWxlbWVudCc7XHJcblxyXG5cdFx0dGhpcy5jdHggPSBjdHg7XHJcblx0XHR0aGlzLlcgPSBjdHguY2FudmFzLndpZHRoO1xyXG5cdFx0dGhpcy5IID0gY3R4LmNhbnZhcy5oZWlnaHQ7XHJcblxyXG5cdFx0dGhpcy5yZWxhdGl2ZV94ID0gMDtcclxuXHRcdHRoaXMucmVsYXRpdmVfeSA9IDA7XHJcblxyXG5cdFx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuXHRcdHRoaXMub3BhY2l0eSA9IDE7XHJcblxyXG5cdFx0dGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLmNoaWxkcmVuID0gW107XHJcblxyXG5cdFx0dGhpcy5ldmVudHMgPSB7fTtcclxuXHR9XHJcblxyXG5cdC8vIFNoYW1lbGVzc2x5IHN0b2xlbiBmcm9tIFRIUkVFLmpzXHJcblx0YWRkKG9iamVjdClcclxuXHR7XHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcblx0XHRcdFx0dGhpcy5hZGQoYXJndW1lbnRzW2ldKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAob2JqZWN0ID09PSB0aGlzKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJIVUQuRWxlbWVudCRhZGQ6IG9iamVjdCBjYW4ndCBiZSBhZGRlZCBhcyBhIGNoaWxkIG9mIGl0c2VsZi5cIiwgb2JqZWN0KTtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iamVjdCBpbnN0YW5jZW9mIEhVREVsZW1lbnQpIHtcclxuXHRcdFx0aWYgKG9iamVjdC5wYXJlbnQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdG9iamVjdC5wYXJlbnQucmVtb3ZlKG9iamVjdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG9iamVjdC5wYXJlbnQgPSB0aGlzO1xyXG5cdFx0XHRvYmplY3QuZGlzcGF0Y2hFdmVudCh7J3R5cGUnOiAnYWRkZWQnfSk7XHJcblxyXG5cdFx0XHR0aGlzLmNoaWxkcmVuLnB1c2gob2JqZWN0KTtcclxuXHRcdH1cclxuXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkhVRC5FbGVtZW50JGFkZDogb2JqZWN0IG5vdCBhbiBpbnN0YW5jZSBvZiBIVURFbGVtZW50LlwiLCBvYmplY3QpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKG9iamVjdClcclxuXHR7XHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcblx0XHRcdFx0dGhpcy5yZW1vdmUoYXJndW1lbnRzW2ldKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKG9iamVjdCk7XHJcblxyXG5cdFx0aWYgKGluZGV4ICE9PSAtMSkge1xyXG5cdFx0XHRvYmplY3QucGFyZW50ID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRvYmplY3QuZGlzcGF0Y2hFdmVudCh7J3R5cGUnOiAncmVtb3ZlZCd9KTtcclxuXHRcdFx0dGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0Q2hpbGRyZW5CeVR5cGUodHlwZSlcclxuXHR7XHJcblx0XHR2YXIgcmVzdWx0ID0gW10sXHJcblx0XHRcdG4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcclxuXHJcblx0XHR3aGlsZSAobi0tKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAodGhpcy5jaGlsZHJlbltuXS50eXBlID09IHR5cGUpXHJcblx0XHRcdFx0cmVzdWx0LnB1c2godGhpcy5jaGlsZHJlbltuXSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jaGlsZHJlbltuXS5jaGlsZHJlbi5sZW5ndGggPiAwKVxyXG5cdFx0XHRcdHJlc3VsdCA9IHJlc3VsdC5jb25jYXQodGhpcy5jaGlsZHJlbltuXS5nZXRDaGlsZHJlbkJ5VHlwZSh0eXBlKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGdldENoaWxkQnlUeXBlKHR5cGUpXHJcblx0e1xyXG5cdFx0dmFyIHJlc3VsdCxcclxuXHRcdFx0aSA9IDAsXHJcblx0XHRcdG4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXHJcblx0XHR7XHJcblx0XHRcdGlmICh0aGlzLmNoaWxkcmVuW25dLnR5cGUgPT0gdHlwZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmNoaWxkcmVuW25dO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jaGlsZHJlbltuXS5jaGlsZHJlbi5sZW5ndGggPiAwKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmVzdWx0ID0gdGhpcy5jaGlsZHJlbltuXS5nZXRDaGlsZEJ5VHlwZSh0eXBlKTtcclxuXHJcblx0XHRcdFx0aWYgKHJlc3VsdClcclxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRpc3BhdGNoRXZlbnQob2JqZWN0KVxyXG5cdHtcclxuXHRcdGlmIChvYmplY3QudHlwZSBpbiB0aGlzLmV2ZW50cylcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5ldmVudHNbb2JqZWN0LnR5cGVdLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhvYmplY3QpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxpc3RlbkV2ZW50KHR5cGUsIGNhbGxiYWNrKVxyXG5cdHtcclxuXHRcdGlmICghKHR5cGUgaW4gdGhpcy5ldmVudHMpKVxyXG5cdFx0XHR0aGlzLmV2ZW50c1t0eXBlXSA9IFtdO1xyXG5cclxuXHRcdHRoaXMuZXZlbnRzW3R5cGVdLnB1c2goY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0ZHJhdyh0aW1lKVxyXG5cdHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSFVELkVsZW1lbnQkZHJhdzogTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nLCB0aGlzLnR5cGUpO1xyXG5cdH1cclxuXHJcblx0ZHJhd0NoaWxkcmVuKHRpbWUpXHJcblx0e1xyXG5cdFx0Zm9yIChsZXQgY2hpbGQsIGkgPSAwOyBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07IGkrKylcclxuXHRcdFx0Y2hpbGQuZHJhdyh0aW1lKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IEJhc2VFbGVtZW50IGZyb20gJy4vRWxlbWVudC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRlcmZhY2UgZXh0ZW5kcyBCYXNlRWxlbWVudFxyXG57XHJcblx0Y29uc3RydWN0b3IoY3R4KVxyXG5cdHtcclxuXHRcdHN1cGVyKGN0eCk7XHJcblxyXG5cdFx0dGhpcy50eXBlID0gJ0hVRC5TY3JlZW4nO1xyXG5cdH1cclxufSIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vRWxlbWVudC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0RWxlbWVudCBleHRlbmRzIEVsZW1lbnRcclxue1xyXG5cdGNvbnN0cnVjdG9yKGN0eCwgdGV4dCwgc3BlYWtlcilcclxuXHR7XHJcblx0XHRzdXBlcihjdHgpO1xyXG5cclxuXHRcdHRoaXMudHlwZSA9ICdIVUQuVGV4dEVsZW1lbnQnO1xyXG5cclxuXHRcdHRoaXMudGV4dCA9IHRleHQgfHwgJyc7XHJcblx0XHR0aGlzLmNvbG9yID0gJ3doaXRlJztcclxuXHJcblx0XHR0aGlzLnggPSAwO1xyXG5cdFx0dGhpcy55ID0gMDtcclxuXHJcblx0XHR0aGlzLm1heFdpZHRoID0gMC45ICogdGhpcy5XO1xyXG5cdFx0dGhpcy5tYXJnaW5MZWZ0ID0gMDtcclxuXHJcblx0XHR0aGlzLmZvbnQgPSAoMC4wNiAqIHRoaXMuSCkgKyAncHggQ2FsaWJyaSc7XHJcblx0XHR0aGlzLmNvbG9yID0gJ3doaXRlJztcclxuXHRcdHRoaXMubGluZUhlaWdodCA9IDAuMDggKiB0aGlzLkg7XHJcblxyXG5cdFx0dGhpcy50eXBld3JpdGUgPSBmYWxzZTtcclxuXHRcdHRoaXMudHlwZXdMZW5ndGggPSAwO1xyXG5cdH1cclxuXHJcblx0ZHJhdyh0aW1lKVxyXG5cdHtcclxuXHRcdHRoaXMuY3R4LnNhdmUoKTtcclxuXHJcblx0XHR0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHRoaXMub3BhY2l0eTtcclxuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcblx0XHR0aGlzLmN0eC5mb250ID0gdGhpcy5mb250O1xyXG5cclxuXHRcdHRoaXMud3JpdGVMaW5lKHRoaXMudGV4dCwgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy54LCB0aGlzLnksIHRoaXMubWF4V2lkdGgpO1xyXG5cclxuXHRcdHRoaXMuY3R4LnJlc3RvcmUoKTtcclxuXHR9XHJcblxyXG5cdHR5cGV3cml0ZVN0ZXAodGV4dClcclxuXHR7XHJcblx0XHRpZiAodGV4dC5sZW5ndGggPiB0aGlzLnR5cGV3TGVuZ3RoKVxyXG5cdFx0XHR0aGlzLnR5cGV3TGVuZ3RoICs9IDE7XHJcblxyXG5cdFx0cmV0dXJuIHRleHQuc3Vic3RyKDAsIHRoaXMudHlwZXdMZW5ndGgpO1xyXG5cdH1cclxuXHJcblx0d3JpdGVMaW5lKHRleHQsIHgsIHksIG1heFdpZHRoKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLnR5cGV3cml0ZSlcclxuXHRcdFx0dGV4dCA9IHRoaXMudHlwZXdyaXRlU3RlcCh0ZXh0KTtcclxuXHJcblx0XHR2YXIgbGFzdFdvcmQgPSAnJyxcclxuXHRcdFx0c2l6ZSA9IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoLFxyXG5cdFx0XHRjdXJyZW50TGluZSA9IHRleHQuc3BsaXQoJyAnKSxcclxuXHRcdFx0bmV4dExpbmUgPSBbXTtcclxuXHJcblx0XHR3aGlsZSAoc2l6ZSA+IG1heFdpZHRoKVxyXG5cdFx0e1xyXG5cdFx0XHRsYXN0V29yZCA9IGN1cnJlbnRMaW5lLnBvcCgpO1xyXG5cdFx0XHRuZXh0TGluZS51bnNoaWZ0KGxhc3RXb3JkKTtcclxuXHRcdFx0dGV4dCA9IGN1cnJlbnRMaW5lLmpvaW4oJyAnKTtcclxuXHRcdFx0c2l6ZSA9IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjdXJyZW50TGluZS5sZW5ndGggPiAwKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLmN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcclxuXHJcblx0XHRcdGlmIChuZXh0TGluZS5sZW5ndGggPiAwKVxyXG5cdFx0XHRcdHRoaXMud3JpdGVMaW5lKG5leHRMaW5lLmpvaW4oJyAnKSwgeCwgeSArIHRoaXMubGluZUhlaWdodCwgbWF4V2lkdGgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1RleHRFbGVtZW50OiBFbCB0ZXh0byBjb250aWVuZSB1bmEgcGFsYWJyYSBtw6FzIGFuY2hhIHF1ZSBlbCBhbmNobyBtw6F4aW1vIGRlbCBjYW52YXMuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0bGFzdFdvcmQgPSBudWxsO1xyXG5cdFx0c2l6ZSA9IG51bGw7XHJcblx0XHRjdXJyZW50TGluZSA9IG51bGw7XHJcblx0XHRuZXh0TGluZSA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRkcmF3MihjdHgpIHtcclxuXHRcdHZhciByZW0gPSB0ZXh0LnN1YnN0cih0aGlzLnRleHRBZHZhbmNlKSxcclxuXHRcdFx0Ly8gaWYgJyAnIG5vdCBpbiB0ZXh0LCB1c2UgdGV4dC5sZW5ndGgsIGVsc2UgdXNlIHBvc2l0aW9uXHJcblx0XHRcdHNwYWNlID0gKHJlbS5pbmRleE9mKCcgJykgKyAxIHx8IHRleHQubGVuZ3RoICsgMSkgLSAxLFxyXG5cdFx0XHR3b3Jkd2lkdGggPSB0aGlzLmN0eC5tZWFzdXJlVGV4dChyZW0uc3Vic3RyaW5nKDAsIHNwYWNlKSkud2lkdGg7XHJcblx0XHR2YXIgdyA9IGN0eC5tZWFzdXJlVGV4dChzdHIuY2hhckF0KGkpKS53aWR0aDtcclxuXHRcdGlmIChjdXJzb3JYICsgd29yZHdpZHRoID49IGNhbnZhcy53aWR0aCAtIHBhZGRpbmcpIHtcclxuXHRcdFx0Y3Vyc29yWCA9IHN0YXJ0WDtcclxuXHRcdFx0Y3Vyc29yWSArPSBsaW5lSGVpZ2h0O1xyXG5cdFx0fVxyXG5cdFx0Y3R4LmZpbGxUZXh0KHN0ci5jaGFyQXQoaSksIGN1cnNvclgsIGN1cnNvclkpO1xyXG5cdFx0aSsrO1xyXG5cdFx0Y3Vyc29yWCArPSB3O1xyXG5cdH1cclxufVxyXG4iXX0=
