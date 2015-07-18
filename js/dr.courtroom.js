(function (DR) {
	"use strict";

	function Courtroom() {
		THREE.Object3D.call(this);

		this.add(
			//  TILED FLOOR
			//  ancho = largo = 160, segmentos = 20
			new Floor(200, 22),

			//  WALLS
			//  total = 8, alto = 80, ancho = 70, apotema = 60
			new Walls(16, 80, 105),

			//  CURTAINS x8
			//  total, ancho = alto, apotema
			new Curtains(8, 36, 102),

			//  PILLARS x8
			//  total, ancho, alto, distancia al centro, desviacion lateral
			new Pillars(8, 5, 80, 101, 18),

			//  LONG CARPETS x8
			//  total, ancho, largo, apotema
			new LongCarpets(8, 8, 90, 20),
			new Platform(),
			new TrialStands()
		);
	}

	Courtroom.TEXTURES = {
		WALLPAPER: '/textures/chapter1-wallpaper.png',
		BASEBOARD: '/textures/chapter1-guardapolvo.png',
		REDRUG: "/textures/alfombraR.png",
		CURTAIN: "/textures/chapter1-salida.png",
		COLUMN: "/textures/chapter1-marcos.png",
		WOOD: "/textures/wood.jpg",
		CLOUDS: "/textures/clouds.jpg"
	};


	function PlatformGeometry(radiusInternal, radiusExternal, segments) {
		THREE.Geometry.call(this);

		radiusInternal = radiusInternal || 20;
		radiusExternal = radiusExternal || 31;
		segments = segments || 32;

		var i,
			twopi = 2 * Math.PI,
			uv = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)];

		for (i = 0; i < segments; i++) {
			this.vertices.push(
				new THREE.Vector3(radiusInternal * Math.cos(i / segments * twopi), radiusInternal * Math.sin(i / segments * twopi), 1),
				new THREE.Vector3(radiusExternal * Math.cos(i / segments * twopi), radiusExternal * Math.sin(i / segments * twopi), 1)
				);

			this.faces.push(
				new THREE.Face3(2 * i + 2, 2 * i, 2 * i + 1),
				new THREE.Face3(2 * i + 1, 2 * i + 3, 2 * i + 2)
				);

			this.faceVertexUvs[0].push(uv, uv);
		}

		i--;
		this.faces[2 * i] = new THREE.Face3(0, 2 * i, 2 * i + 1);
		this.faces[2 * i + 1] = new THREE.Face3(2 * i + 1, 1, 0);

		this.computeFaceNormals();
		this.computeVertexNormals();
	}

	function StandGeometry(dist, altu) {
		THREE.Geometry.call(this);

		// Atril
		this.vertices.push(
			new THREE.Vector3(0.8, dist - 2, altu + 10.2), // 4 del frente   0
			new THREE.Vector3(-0.8, dist - 2, altu + 10.2),
			new THREE.Vector3(-0.8, dist - 2, altu + 8.7),
			new THREE.Vector3(0.8, dist - 2, altu + 8.7),
			new THREE.Vector3(0.8, dist + 4, altu + 10.2), // 4 detras      4
			new THREE.Vector3(-0.8, dist + 4, altu + 10.2),
			new THREE.Vector3(-0.8, dist + 4, altu + 8.5),
			new THREE.Vector3(0.8, dist + 4, altu + 8.5),
			new THREE.Vector3(0.8, dist + 0, altu + 7.5), // 4 debajo      8
			new THREE.Vector3(-0.8, dist + 0, altu + 7.5),
			new THREE.Vector3(-0.8, dist + 3, altu + 7.5),
			new THREE.Vector3(0.8, dist + 3, altu + 7.5)
			);

		this.faces.push(
			new THREE.Face3(0, 1, 2), // Frente
			new THREE.Face3(2, 3, 0),
			new THREE.Face3(3, 2, 9),
			new THREE.Face3(9, 8, 3),
			new THREE.Face3(4, 5, 1), // Arriba
			new THREE.Face3(1, 0, 4),
			new THREE.Face3(4, 0, 3), // Derecha
			new THREE.Face3(3, 7, 4),
			new THREE.Face3(7, 3, 8),
			new THREE.Face3(8, 11, 7),
			new THREE.Face3(1, 5, 6), // Izquierda
			new THREE.Face3(6, 2, 1),
			new THREE.Face3(2, 6, 10),
			new THREE.Face3(10, 9, 2),
			new THREE.Face3(5, 4, 7), // Atrás
			new THREE.Face3(7, 6, 5),
			new THREE.Face3(6, 7, 11),
			new THREE.Face3(11, 10, 6),
			new THREE.Face3(8, 9, 10), // Abajo
			new THREE.Face3(10, 11, 8)
			);

		// Poste
		this.vertices.push(
			new THREE.Vector3(0.6, dist + 0.2, altu + 7.5), // 4 del frente, 12
			new THREE.Vector3(-0.6, dist + 0.2, altu + 7.5),
			new THREE.Vector3(-0.6, dist + 0.2, altu + 1.1),
			new THREE.Vector3(0.6, dist + 0.2, altu + 1.1),
			new THREE.Vector3(-0.6, dist + 2.8, altu + 7.5), // 4 de atrás
			new THREE.Vector3(0.6, dist + 2.8, altu + 7.5),
			new THREE.Vector3(0.6, dist + 2.8, altu + 1.1),
			new THREE.Vector3(-0.6, dist + 2.8, altu + 1.1)
			);

		this.faces.push(
			new THREE.Face3(12, 13, 14),
			new THREE.Face3(14, 15, 12),
			new THREE.Face3(16, 17, 18),
			new THREE.Face3(18, 19, 16),
			new THREE.Face3(17, 12, 15),
			new THREE.Face3(15, 18, 17),
			new THREE.Face3(13, 16, 19),
			new THREE.Face3(19, 14, 13)
			);

		// Base
		this.vertices.push(
			new THREE.Vector3(0.8, dist + 0, altu + 1.4), // 4 del frente
			new THREE.Vector3(-0.8, dist + 0, altu + 1.4),
			new THREE.Vector3(-0.8, dist + 0, altu + 0.0),
			new THREE.Vector3(0.8, dist + 0, altu + 0.0),
			new THREE.Vector3(-0.8, dist + 3, altu + 1.4), // 2 superiores
			new THREE.Vector3(0.8, dist + 3, altu + 1.4),
			new THREE.Vector3(0.8, dist + 4, altu + 0.7), // 2 del bisel
			new THREE.Vector3(-0.8, dist + 4, altu + 0.7),
			new THREE.Vector3(0.8, dist + 4, altu + 0.0), // 2 inferiores
			new THREE.Vector3(-0.8, dist + 4, altu + 0.0)
			);

		this.faces.push(
			new THREE.Face3(20, 21, 22),
			new THREE.Face3(22, 23, 20),
			new THREE.Face3(25, 24, 21),
			new THREE.Face3(21, 20, 25),
			new THREE.Face3(20, 23, 28),
			new THREE.Face3(28, 26, 20),
			new THREE.Face3(26, 25, 20),
			new THREE.Face3(24, 25, 26),
			new THREE.Face3(26, 27, 24),
			new THREE.Face3(27, 26, 28),
			new THREE.Face3(28, 29, 27),
			new THREE.Face3(21, 24, 27),
			new THREE.Face3(21, 27, 29),
			new THREE.Face3(21, 29, 22)
			);

		var n = this.faces.length / 2,
			j = [new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)],
			k = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];

		this.faceVertexUvs[0] = [];
		while (n--)
			this.faceVertexUvs[0].push(j, k);

		this.computeFaceNormals();
		this.computeVertexNormals();
	}

	function Floor(ancho, segm) {
		var material, geometry,
			i, j, total;

		ancho = ancho || 120;
		segm = segm || 18;

		material = new THREE.MeshFaceMaterial([
			new THREE.MeshLambertMaterial({
				color: 0x000000,
				polygonOffset: true,
				polygonOffsetFactor: 1.0,
				polygonOffsetUnits: 4.0
			}),
			new THREE.MeshLambertMaterial({
				color: 0xFFFFFF,
				polygonOffset: true,
				polygonOffsetFactor: 1.0,
				polygonOffsetUnits: 4.0
			})
		]);

		geometry = new THREE.PlaneGeometry(ancho, ancho, segm, segm);

		total = geometry.faces.length / 2;
		for (i = 0; i < total; i++) {
			j = i * 2;
			geometry.faces[j].materialIndex = ((i + Math.floor(i / segm)) % 2);
			geometry.faces[j + 1].materialIndex = ((i + Math.floor(i / segm)) % 2);
		}

		THREE.Mesh.call(this, geometry, material);
		this.rotation.z = Math.PI / 8;
		this.position.z = -0.05;

		material = geometry = null;
	}


	function WallsBufferGeometry(total, height, apothem) {
		THREE.BufferGeometry.call(this);

		this.type = 'WallsBufferGeometry';

		var width = apothem * 2 * Math.tan(Math.PI / total);

		var width_half = width / 2;
		var height_half = height / 2;

		var gridX = 1;
		var gridY = 1;

		var gridX1 = gridX + 1;
		var gridY1 = gridY + 1;

		var segment_width = width / gridX;
		var segment_height = height / gridY;

		var vertices = new Float32Array(gridX1 * gridY1 * 3);
		var normals = new Float32Array(gridX1 * gridY1 * 3);
		var uvs = new Float32Array(gridX1 * gridY1 * 2);

		var offset = 0;
		var offset2 = 0;
	}

	function Walls(total, height, apothem) {
		THREE.Object3D.call(this);

		var width,
			textura, material, geometry, malla,
			i, angulo;

		width = apothem * 2 * Math.tan(Math.PI / total);

		textura = THREE.ImageUtils.loadTexture(Courtroom.TEXTURES.WALLPAPER);
		textura.wrapT = THREE.RepeatWrapping;
		textura.wrapS = THREE.RepeatWrapping;
		textura.repeat.set(1, 1);

		material = new THREE.MeshBasicMaterial({
			color: 0x2D2867,
			side: THREE.FrontSide,
			map: textura
		});

		geometry = new THREE.PlaneBufferGeometry(width, height, 1, 1);

		for (i = 0; i < total; i++) {
			angulo = i / total * 2 * Math.PI;
			malla = new THREE.Mesh(geometry, material);
			malla.rotation.x = Math.PI / 2;
			malla.rotation.y = -angulo;
			malla.position.x = apothem * Math.sin(angulo);
			malla.position.y = apothem * Math.cos(angulo);
			malla.position.z = height / 2;
			this.add(malla);
		}

		textura = THREE.ImageUtils.loadTexture(Courtroom.TEXTURES.BASEBOARD);

		material = new THREE.MeshBasicMaterial({
			color: 0xAAAAAA,
			side: THREE.FrontSide,
			map: textura
		});

		geometry = new THREE.PlaneBufferGeometry(width, 3, 1, 1);

		for (i = 0; i < total; i++) {
			angulo = i / total * 2 * Math.PI;
			malla = new THREE.Mesh(geometry, material);
			malla.rotation.x = Math.PI / 2;
			malla.rotation.y = -angulo;
			malla.position.x = (apothem - 0.05) * Math.sin(angulo);
			malla.position.y = (apothem - 0.05) * Math.cos(angulo);
			malla.position.z = 1.5;
			this.add(malla);
		}

		textura = material = geometry = malla = null;
	}

	function LongCarpets(total, width, longitude, apothem) {
		THREE.Object3D.call(this);

		var textura, material, geometry, malla,
			i, angulo;

		textura = THREE.ImageUtils.loadTexture(Courtroom.TEXTURES.REDRUG);
		textura.wrapT = THREE.RepeatWrapping;
		textura.repeat.set(1, 3);

		material = new THREE.MeshLambertMaterial({
			color: 0xFFFFFF,
			side: THREE.FrontSide,
			map: textura
		});

		geometry = new THREE.PlaneBufferGeometry(width, longitude, 1, 1);

		for (i = 0.5; i < 8; i++) {
			angulo = i / total * 2 * Math.PI;
			malla = new THREE.Mesh(geometry, material);
			malla.rotation.z = angulo;
			malla.position.x = (apothem + longitude / 2) * Math.sin(-angulo);
			malla.position.y = (apothem + longitude / 2) * Math.cos(angulo);
			malla.position.z = 0.05;
			this.add(malla);
		}

		textura = material = geometry = malla = null;
	}

	function Curtains(total, alto, distancia) {
		THREE.Object3D.call(this);

		var textura, material, geometry, malla,
			i, angulo;

		textura = THREE.ImageUtils.loadTexture(Courtroom.TEXTURES.CURTAIN);

		material = new THREE.MeshBasicMaterial({
			color: 0xEEEEEE,
			side: THREE.FrontSide,
			map: textura,
			transparent: true
		});

		geometry = new THREE.PlaneBufferGeometry(alto, alto, 1, 1);

		for (i = 0.5; i < total; i++) {
			angulo = i / total * 2 * Math.PI;
			malla = new THREE.Mesh(geometry, material);
			malla.rotation.x = Math.PI / 2;
			malla.rotation.y = -angulo;
			malla.position.x = distancia * Math.sin(angulo);
			malla.position.y = distancia * Math.cos(angulo);
			malla.position.z = alto / 2 - 1;
			this.add(malla);
		}

		textura = material = geometry = malla = null;
	}

	function Pillars(total, ancho, alto, distancia, desviacion) {
		THREE.Object3D.call(this);

		var textura, material, geometry, malla,
			i, angulo,
			adicional = Math.atan(desviacion / distancia);

		textura = THREE.ImageUtils.loadTexture(Courtroom.TEXTURES.COLUMN);
		textura.wrapT = THREE.RepeatWrapping;
		textura.repeat.set(1, 10);

		material = new THREE.MeshBasicMaterial({
			color: 0xFFFFFF,
			side: THREE.FrontSide,
			map: textura
		});

		geometry = new THREE.PlaneBufferGeometry(ancho, alto, 1, 1);

		for (i = 0.5; i < total; i++) {
			angulo = i / total * 2 * Math.PI;

			malla = new THREE.Mesh(geometry, material);
			malla.rotation.x = Math.PI / 2;
			malla.rotation.y = -angulo;
			malla.position.x = distancia * Math.sin(angulo + adicional);
			malla.position.y = distancia * Math.cos(angulo + adicional);
			malla.position.z = alto / 2;
			this.add(malla);

			malla = new THREE.Mesh(geometry, material);
			malla.rotation.x = Math.PI / 2;
			malla.rotation.y = -angulo;
			malla.position.x = distancia * Math.sin(angulo - adicional);
			malla.position.y = distancia * Math.cos(angulo - adicional);
			malla.position.z = alto / 2;
			this.add(malla);
		}

		textura = material = geometry = malla = null;
	}

	function Platform() {
		THREE.Object3D.call(this);

		var textura, material, geometry, malla;

		//  ALFOMBRA RADIAL
		//  radioInt = 17.5, radioExt = 26.5, segmentos = 32
		textura = THREE.ImageUtils.loadTexture(Courtroom.TEXTURES.REDRUG);
		textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
		textura.repeat.set(1, 1);

		material = new THREE.MeshLambertMaterial({
			color: 0xFFFFFF,
			side: THREE.FrontSide,
			map: textura
		});

		geometry = new PlatformGeometry(17.5, 27.5, 32);

		malla = new THREE.Mesh(geometry, material);
		malla.name = 'alfombra_radial';
		malla.rotation.z = 11.25 * Math.PI / 180;
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

		textura = material = geometry = malla = null;
	}

	function TrialStands() {
		THREE.Object3D.call(this);

		var textura, material, geometry, malla,
			i, j, k;

		textura = THREE.ImageUtils.loadTexture(Courtroom.TEXTURES.WOOD);

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
			new StandGeometry(17, 1),
			//  SOPORTE SUPERIOR: ancho = 7, alto = 1.5, prof = 1
			new THREE.BoxGeometry(7, 1.5, 1),
			//  UNIÓN INFERIOR: ancho = 7, alto = 1.2, prof = 1
			new THREE.BoxGeometry(7, 1.2, 1)
		];

		for (i = 0; i < 16; i++) {
			//      POSTE INTERMEDIO
			malla = new THREE.Mesh(geometry[0], material);
			malla.rotation.z = ((i + 0.5) * 360 / 16) * Math.PI / 180;
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
		textura = THREE.ImageUtils.loadTexture(Courtroom.TEXTURES.CLOUDS);
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

	StandGeometry.prototype = Object.create(THREE.Geometry.prototype);
	PlatformGeometry.prototype = Object.create(THREE.Geometry.prototype);

	Floor.prototype = Object.create(THREE.Mesh.prototype);
	Walls.prototype = Object.create(THREE.Mesh.prototype);
	LongCarpets.prototype = Object.create(THREE.Mesh.prototype);
	Curtains.prototype = Object.create(THREE.Mesh.prototype);
	Pillars.prototype = Object.create(THREE.Mesh.prototype);
	Platform.prototype = Object.create(THREE.Mesh.prototype);
	TrialStands.prototype = Object.create(THREE.Mesh.prototype);

	Object.defineProperties(Courtroom, {
		PlatformGeometry: { value: PlatformGeometry },
		StandGeometry: { value: StandGeometry },
		WallsBufferGeometry: { value: WallsBufferGeometry },
		Floor: { value: Floor },
		Walls: { value: Walls },
		LongCarpets: { value: LongCarpets },
		Curtains: { value: Curtains },
		Pillars: { value: Pillars },
		Platform: { value: Platform },
		TrialStands: { value: TrialStands }
	});

	Courtroom.prototype = Object.create(THREE.Mesh.prototype);

	Object.defineProperty(DR, 'Courtroom', {
		value: Courtroom,
		writable: false
	});

})(window.DR || (window.DR = {}));