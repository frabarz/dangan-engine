/* global Promise, THREE */
var DR = DR || {};

DR.Escenario = (function () {
	"use strict";

	function renderCharacters() {
		var i, ang, sen, cos,
			tarjFrente, tarjFondo,
			total = 16, // DR.CHARACTERS.length
			geom = new THREE.PlaneBufferGeometry(10, 20);

		for (i = 0; i < total; i++) {
			if (!DR.CHARACTERS[i])
				continue;

			ang = i / total * 2 * Math.PI;
			sen = Math.sin(ang);
			cos = Math.cos(ang);

			tarjFrente = new THREE.Mesh(
				geom,
				new THREE.MeshBasicMaterial({
					color: 0xFFFFFF,
					map: DR.Sprites.getTexture(DR.CHARACTERS[i]),
					transparent: true,
					side: THREE.FrontSide
				})
				);
			tarjFrente.name = DR.CHARACTERS[i];
			tarjFrente.rotation.x = Math.PI / 2;
			tarjFrente.rotation.y = -ang;
			tarjFrente.position.x = 22 * sen;
			tarjFrente.position.y = 22 * cos;
			tarjFrente.position.z = 11;

			tarjFondo = new THREE.Mesh(
				geom,
				new THREE.MeshBasicMaterial({
					color: 0x000000,
					map: DR.Sprites.getTexture(DR.CHARACTERS[i]),
					transparent: true,
					side: THREE.BackSide
				})
				);
			tarjFondo.rotation.x = Math.PI / 2;
			tarjFondo.rotation.y = -ang;
			tarjFondo.position.x = 22.05 * sen;
			tarjFondo.position.y = 22.05 * cos;
			tarjFondo.position.z = 11;

			DR.escena.add(tarjFrente);
			DR.escena.add(tarjFondo);
		}
	}

    function geomPlataforma(radInt, radExt, segmentos) {
        radInt = radInt || 20;
        radExt = radExt || 31;
        segmentos = segmentos || 32;
        var i,
            geom = new THREE.Geometry(),
            uv = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)];

        for (i = 0; i < segmentos; i++) {
            geom.vertices.push(new THREE.Vector3(radInt * Math.cos(i / segmentos * 2 * Math.PI), radInt * Math.sin(i / segmentos * 2 * Math.PI), 1)); // 3i+1
            geom.vertices.push(new THREE.Vector3(radExt * Math.cos(i / segmentos * 2 * Math.PI), radExt * Math.sin(i / segmentos * 2 * Math.PI), 1)); // 3i
            geom.faces.push(new THREE.Face3(2 * i + 2, 2 * i, 2 * i + 1));
            geom.faces.push(new THREE.Face3(2 * i + 1, 2 * i + 3, 2 * i + 2));
            geom.faceVertexUvs[0].push(uv);
            geom.faceVertexUvs[0].push(uv);
        }
        i--;
        geom.faces[2 * i] = new THREE.Face3(0, 2 * i, 2 * i + 1);
        geom.faces[2 * i + 1] = new THREE.Face3(2 * i + 1, 1, 0);

        geom.computeFaceNormals();
        geom.computeVertexNormals();

        return geom;
    }

    function geomBanquillo(dist, altu) {
        var geom = new THREE.Geometry();

        // Atril
        geom.vertices.push(
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

        geom.faces.push(
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
        geom.vertices.push(
            new THREE.Vector3(0.6, dist + 0.2, altu + 7.5), // 4 del frente, 12
            new THREE.Vector3(-0.6, dist + 0.2, altu + 7.5),
            new THREE.Vector3(-0.6, dist + 0.2, altu + 1.1),
            new THREE.Vector3(0.6, dist + 0.2, altu + 1.1),
            new THREE.Vector3(-0.6, dist + 2.8, altu + 7.5), // 4 de atrás
            new THREE.Vector3(0.6, dist + 2.8, altu + 7.5),
            new THREE.Vector3(0.6, dist + 2.8, altu + 1.1),
            new THREE.Vector3(-0.6, dist + 2.8, altu + 1.1)
            );

        geom.faces.push(
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
        geom.vertices.push(
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

        geom.faces.push(
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

        var n = geom.faces.length / 2,
            j = [new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)],
            k = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];
        geom.faceVertexUvs[0] = [];
        while (n--)
            geom.faceVertexUvs[0].push(j, k);

        geom.computeFaceNormals();
        geom.computeVertexNormals();

        return geom;
    }

    function buildPiso(ancho, segm) {
        var material, geometria, malla,
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

        geometria = new THREE.PlaneGeometry(ancho, ancho, segm, segm);

        total = geometria.faces.length / 2;
        for (i = 0; i < total; i++) {
            j = i * 2;
            geometria.faces[j].materialIndex = ((i + Math.floor(i / segm)) % 2);
            geometria.faces[j + 1].materialIndex = ((i + Math.floor(i / segm)) % 2);
        }

        malla = new THREE.Mesh(geometria, material);
        malla.rotation.z = Math.PI / 8;
        malla.position.z = -0.05;

        material = geometria = null;
        return malla;
    }

    function buildParedes(total, alto, ancho, apotema) {
        var textura, material, geometria, malla,
            i, angulo,
            output = [];

        textura = THREE.ImageUtils.loadTexture('/textures/chapter1-wallpaper.png');
        textura.wrapT = THREE.RepeatWrapping;
        textura.wrapS = THREE.RepeatWrapping;
        textura.repeat.set(1, 1);

        material = new THREE.MeshBasicMaterial({
            color: 0x2D2867,
            side: THREE.FrontSide,
            map: textura
        });

        geometria = new THREE.PlaneBufferGeometry(ancho, alto, 1, 1);

        for (i = 0; i < total; i++) {
            angulo = i / total * 2 * Math.PI;
            malla = new THREE.Mesh(geometria, material);
            malla.rotation.x = Math.PI / 2;
            malla.rotation.y = -angulo;
            malla.position.x = apotema * Math.sin(angulo);
            malla.position.y = apotema * Math.cos(angulo);
            malla.position.z = alto / 2;
            output.push(malla);
        }

        textura = THREE.ImageUtils.loadTexture('/textures/chapter1-guardapolvo.png');

        material = new THREE.MeshBasicMaterial({
            color: 0xAAAAAA,
            side: THREE.FrontSide,
            map: textura
        });

        geometria = new THREE.PlaneBufferGeometry(ancho, 3, 1, 1);

        for (i = 0; i < total; i++) {
            angulo = i / total * 2 * Math.PI;
            malla = new THREE.Mesh(geometria, material);
            malla.rotation.x = Math.PI / 2;
            malla.rotation.y = -angulo;
            malla.position.x = (apotema - 0.05) * Math.sin(angulo);
            malla.position.y = (apotema - 0.05) * Math.cos(angulo);
            malla.position.z = 1.5;
            output.push(malla);
        }

        textura = material = geometria = malla = null;
        return output;
    }

    function buildAlfombrasRectas(total, ancho, largo, apotema) {
        var textura, material, geometria, malla,
            i, angulo,
            output = [];

        textura = THREE.ImageUtils.loadTexture("/textures/alfombraR.png");
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set(1, 3);

        material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            side: THREE.FrontSide,
            map: textura
        });

        geometria = new THREE.PlaneBufferGeometry(ancho, largo, 1, 1);

        for (i = 0.5; i < 8; i++) {
            angulo = i / total * 2 * Math.PI;
            malla = new THREE.Mesh(geometria, material);
            malla.rotation.z = angulo;
            malla.position.x = (apotema + largo / 2) * Math.sin(-angulo);
            malla.position.y = (apotema + largo / 2) * Math.cos(angulo);
            malla.position.z = 0.05;
            output.push(malla);
        }

        textura = material = geometria = malla = null;
        return output;
    }

    function buildCortinas(total, alto, distancia) {
        var textura, material, geometria, malla,
            i, angulo,
            output = [];

        textura = THREE.ImageUtils.loadTexture("/textures/chapter1-salida.png");

        material = new THREE.MeshBasicMaterial({
            color: 0xEEEEEE,
            side: THREE.FrontSide,
            map: textura,
            transparent: true
        });

        geometria = new THREE.PlaneBufferGeometry(alto, alto, 1, 1);

        for (i = 0.5; i < total; i++) {
            angulo = i / total * 2 * Math.PI;
            malla = new THREE.Mesh(geometria, material);
            malla.rotation.x = Math.PI / 2;
            malla.rotation.y = -angulo;
            malla.position.x = distancia * Math.sin(angulo);
            malla.position.y = distancia * Math.cos(angulo);
            malla.position.z = alto / 2 - 1;
            output.push(malla);
        }

        textura = material = geometria = malla = null;
        return output;
    }

    function buildMarcos(total, ancho, alto, distancia, desviacion) {
        var textura, material, geometria, malla,
            i, angulo,
            adicional = Math.atan(desviacion / distancia),
            output = [];

        textura = THREE.ImageUtils.loadTexture("/textures/chapter1-marcos.png");
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set(1, 10);

        material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.FrontSide,
            map: textura
        });

        geometria = new THREE.PlaneBufferGeometry(ancho, alto, 1, 1);

        for (i = 0.5; i < total; i++) {
            angulo = i / total * 2 * Math.PI;

            malla = new THREE.Mesh(geometria, material);
            malla.rotation.x = Math.PI / 2;
            malla.rotation.y = -angulo;
            malla.position.x = distancia * Math.sin(angulo + adicional);
            malla.position.y = distancia * Math.cos(angulo + adicional);
            malla.position.z = alto / 2;
            output.push(malla);

            malla = new THREE.Mesh(geometria, material);
            malla.rotation.x = Math.PI / 2;
            malla.rotation.y = -angulo;
            malla.position.x = distancia * Math.sin(angulo - adicional);
            malla.position.y = distancia * Math.cos(angulo - adicional);
            malla.position.z = alto / 2;
            output.push(malla);
        }

        textura = material = geometria = malla = null;
        return output;
    }

    function buildPlataforma() {
        var textura, material, geometria, malla,
            output = [];

        //  ALFOMBRA RADIAL
        //  radioInt = 17.5, radioExt = 26.5, segmentos = 32
        textura = THREE.ImageUtils.loadTexture("/textures/alfombraR.png");
        textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set(1, 1);

        material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            side: THREE.FrontSide,
            map: textura
        });

        geometria = geomPlataforma(17.5, 27.5, 32);

        malla = new THREE.Mesh(geometria, material);
        malla.name = 'alfombra_radial';
        malla.rotation.z = 11.25 * Math.PI / 180;
        output.push(malla);

        //  PLATAFORMA: CILINDRO EXTERIOR
        //  radioSup = 28.5, radioInf = 28.5, altura = 1, segmRadiales = 32, segmVerticales = 1, abierto = true
        material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.FrontSide
        });

        geometria = new THREE.CylinderGeometry(27.5, 27.5, 1, 32, 1, true);

        malla = new THREE.Mesh(geometria, material);
        malla.rotation.x = Math.PI / 2;
        malla.rotation.y = 11.25 * Math.PI / 180;
        malla.position.z = 0.5;
        output.push(malla);

        textura = material = geometria = malla = null;
        return output;
    }

    function buildBanquillos() {
        var textura, material, geometria, malla,
            i, j, k,
            output = [];

        textura = THREE.ImageUtils.loadTexture("/textures/wood.jpg");

        //  BASES DE MADERA
        //  radioSup = 16.5, radioInf = 14.5, altura = 1, segmRadiales = 16, segmVerticales = 1, abierto = true
        material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            emissive: 0x333333,
            side: THREE.BackSide,
            map: textura
        });

        geometria = new THREE.CylinderGeometry(17.5, 17.5 - 2, 1, 16, 1, true);
        geometria.faceVertexUvs[0] = [];
        j = [new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)];
        k = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];
        for (i = 0; i < 16; i++) {
            geometria.faceVertexUvs[0].push(j);
            geometria.faceVertexUvs[0].push(k);
        }

        malla = new THREE.Mesh(geometria, material);
        malla.name = 'platfront';
        malla.rotation.x = Math.PI / 2;
        malla.rotation.y = 11.25 * Math.PI / 180;
        malla.position.z = 0.5;
        output.push(malla);


        //  BANQUILLOS x16
        material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            emissive: 0x222222,
            side: THREE.FrontSide,
            map: textura
        });

        geometria = [
            //  POSTE INTERMEDIO: distancia del centro = 19, posición z = 1
            geomBanquillo(17, 1),
            //  SOPORTE SUPERIOR: ancho = 7, alto = 1.5, prof = 1
            new THREE.BoxGeometry(7, 1.5, 1),
            //  UNIÓN INFERIOR: ancho = 7, alto = 1.2, prof = 1
            new THREE.BoxGeometry(7, 1.2, 1)
        ];

        for (i = 0; i < 16; i++) {
            //      POSTE INTERMEDIO
            malla = new THREE.Mesh(geometria[0], material);
            malla.rotation.z = ((i + 0.5) * 360 / 16) * Math.PI / 180;
            output.push(malla);

            //      SOPORTE SUPERIOR
            malla = new THREE.Mesh(geometria[1], material);
            malla.rotation.z = (90 + i * 360 / 16) * Math.PI / 180;
            malla.position.x = 19.1 * Math.cos(i / 8 * Math.PI);
            malla.position.y = 19.1 * Math.sin(i / 8 * Math.PI);
            malla.position.z = 9.8;
            output.push(malla);

            //      UNIÓN INFERIOR
            malla = new THREE.Mesh(geometria[2], material);
            malla.rotation.z = (90 + i * 360 / 16) * Math.PI / 180;
            malla.position.x = 17.5 * Math.cos(i / 8 * Math.PI);
            malla.position.y = 17.5 * Math.sin(i / 8 * Math.PI);
            malla.position.z = 1.6;
            output.push(malla);
        }

        //  TUBO CIRCULAR
        //  radio = 18.2, diametro = 0.35, segmRadiales = 16, segmTubulares = 80
        textura = THREE.ImageUtils.loadTexture("/textures/clouds.jpg");
        textura.wrapT = textura.wrapS = THREE.RepeatWrapping;
        textura.repeat.set(30, 1);

        material = new THREE.MeshLambertMaterial({
            color: 0x33898F,
            emissive: 0x33898F,
            side: THREE.FrontSide,
            map: textura
        });

        geometria = new THREE.TorusGeometry(16.2, 0.35, 10, 80);

        malla = new THREE.Mesh(geometria, material);
        malla.position.z = 10.1;
        output.push(malla);

        textura = material = geometria = malla = null;
        return output;
    }

    function rendererizar(escena) {
        var objeto,
            geometria, geom2, geom3;

        //  TARJETAS DE DR.CHARACTERSONAJES
        renderCharacters();

        //  PISO
        //  ancho = largo = 160, segmentos = 20
        objeto = buildPiso(200, 22);
        escena.add(objeto);

        //  PAREDES DE FONDO
        //  total = 8, alto = 80, ancho = 70, apotema = 60
        objeto = buildParedes(16, 80, 50, 105);
        escena.add.apply(escena, objeto);

        //  ALFOMBRAS RECTAS x8
        //  total, ancho, largo, apotema
        objeto = buildAlfombrasRectas(8, 8, 90, 20);
        escena.add.apply(escena, objeto);

        //  CORTINAS x8
        //  total, ancho = alto, apotema
        objeto = buildCortinas(8, 36, 102);
        escena.add.apply(escena, objeto);

        //  MARCOS x8
        //  total, ancho, alto, distancia al centro, desviacion lateral
        objeto = buildMarcos(8, 5, 80, 101, 18);
        escena.add.apply(escena, objeto);

        //  PLATAFORMA: ALFOMBRA + CILINDRO EXTERIOR OSCURO + CONO INTERIOR DE MADERA
        objeto = buildPlataforma();
        escena.add.apply(escena, objeto);

        objeto = buildBanquillos();
        escena.add.apply(escena, objeto);

        objeto = geometria = geom2 = geom3 = null;
    }

    function inicializar(ancho) {
        var escena, camara,
            hud,
            renderer,
            light,
            canvasWidth = ancho || window.innerWidth,
            canvasHeight = Math.floor(9 / 16 * canvasWidth);

        if (canvasHeight > window.innerHeight) {
            canvasHeight = window.innerHeight;
            canvasWidth = Math.floor(16 / 9 * canvasHeight);
        }

        renderer = new THREE.WebGLRenderer({
            antialias: true,
			//            preserveDrawingBuffer: true
        });
        renderer.setClearColor(0x000000, 1);
        renderer.setSize(canvasWidth, canvasHeight);

        // ESCENA Y CAMARA
        camara = new THREE.PerspectiveCamera(40, canvasWidth / canvasHeight, 1, 300);
        camara.position.set(0, 0, 10);
        camara.lookAt(new THREE.Vector3(0, 10, 10));

        escena = new THREE.Scene();
        escena.add(camara);

        // HUD
        hud = document.createElement('canvas');
        hud.id = 'hud';
        hud.width = canvasWidth;
        hud.height = canvasHeight;

        // LUZ AMBIENTAL
        light = new THREE.PointLight(0xffffff, 1.5, 130);
        light.position.set(0, 0, 30);
        escena.add(light);

        function renderizar() {
			renderer.render(escena, camara);
        }

        DR.renderizar = renderizar;

        DR.canvas = {
            width: canvasWidth,
            height: canvasHeight
        };

        DR.renderer = renderer;
        DR.escena = escena;
        DR.camara = camara;
        DR.hud = hud.getContext('2d');

        light = canvasHeight = canvasWidth = null;
    }

    DR.hudClear = function () {
		DR.hud.clearRect(0, 0, DR.canvas.width, DR.canvas.height);
    }

    return {
        inicializar: inicializar,
        get presencia() {
            var num = DR.CHARACTERS.length,
                flag = '';
            while (num--)
                flag += ~~(!DR.CHARACTERS[num]);

            return flag;
        },
        construir: rendererizar
    };
})();