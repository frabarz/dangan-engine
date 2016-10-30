import CylinderBufferGeometry from './CylinderBufferGeometry.js';
import PlatformBufferGeometry from './PlatformBufferGeometry.js';
import StandGeometry from './StandGeometry.js';

var TEXTURES;

function textureLoader(src) {
    var texture = new THREE.Texture(new Image);
    texture.image.onload = ImageLoadHandler.bind(texture);
    texture.image.src = Courtroom.TEXTURE_RELATIVE_URI + src;
    return texture;
}

function ImageLoadHandler() {
    this.needsUpdate = true;
}

class Courtroom extends THREE.Object3D
{
    constructor(apothem, height)
    {
        super();
        
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
                .setPillars(3, height),

            new Platform(),
            new TrialStands()
            );
    }
}

class Floor extends THREE.Mesh
{
    constructor(ancho, segm)
    {
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

        super(geometry, material);
        
        this.rotation.z = Math.PI / 8;
        this.position.z = -0.05;

        material = geometry = null;
    }
}

class Walls extends THREE.Object3D
{
    constructor(amount, height, apothem)
    {
        super();
        
        var material, geometry;

        material = new THREE.MeshBasicMaterial({
            color: 0x2D2867,
            side: THREE.BackSide,
            map: TEXTURES.WALLPAPER
        });
        geometry = new CylinderBufferGeometry(amount, height, apothem);
        this.add(new THREE.Mesh(geometry, material));

        TEXTURES.BASEBOARD.wrapT = THREE.RepeatWrapping;
        TEXTURES.BASEBOARD.repeat.set(2, 1);
        material = new THREE.MeshBasicMaterial({
            color: 0xAAAAAA,
            side: THREE.BackSide,
            map: TEXTURES.BASEBOARD
        });
        geometry = new CylinderBufferGeometry(amount, height * 0.04, apothem - 0.05);
        
        this.add(new THREE.Mesh(geometry, material));
    }
}

class Exits extends THREE.Object3D
{
    constructor(amount, apothem)
    {
        super();

        this.amount = amount;
        this.apothem = apothem;
    }
    
    setCurtains(width)
    {
        var i, angle,
            geometry, material, mesh;

        geometry = new THREE.PlaneBufferGeometry(width, width, 1, 1);

        material = new THREE.MeshBasicMaterial({
            color: 0xEEEEEE,
            side: THREE.FrontSide,
            map: TEXTURES.CURTAIN,
            transparent: true
        });

        for (i = 0.5; i < this.amount; i++) {
            angle = (2 * Math.PI) * i / this.amount;

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
    
    setCarpets(width, longitude)
    {
        var i, angle,
            geometry, material, mesh;

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

    setPillars(radius, height)
    {
        var texture, material, geometry, mesh,
            i, angle, deviation;

        texture = TEXTURES.COLUMN;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 2);

        material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.FrontSide,
            map: texture
        });

        geometry = new CylinderBufferGeometry(4, height, radius);

        // Custom UV mapping for the game extracted texture
        angle = [0, 0.17578125, 0.4453125, 0.73046875, 1];
        for (i = 0; i < 4; i++) {
            geometry.attributes.uv.array[i * 12 +  0] = angle[i+1];
            geometry.attributes.uv.array[i * 12 +  1] = 1;

            geometry.attributes.uv.array[i * 12 +  2] = angle[i];
            geometry.attributes.uv.array[i * 12 +  3] = 1;

            geometry.attributes.uv.array[i * 12 +  4] = angle[i];
            geometry.attributes.uv.array[i * 12 +  5] = 0;


            geometry.attributes.uv.array[i * 12 +  6] = angle[i];
            geometry.attributes.uv.array[i * 12 +  7] = 0;

            geometry.attributes.uv.array[i * 12 +  8] = angle[i+1];
            geometry.attributes.uv.array[i * 12 +  9] = 0;

            geometry.attributes.uv.array[i * 12 + 10] = angle[i+1];
            geometry.attributes.uv.array[i * 12 + 11] = 1;
        }

        deviation = Math.atan(0.46 * Math.tan(Math.PI / this.amount));

        for (i = 0; i < this.amount; i++) {
            angle = (2 * Math.PI) * i / this.amount;


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
}

class Platform extends THREE.Object3D
{
    constructor()
    {
        super();

        var material, geometry, malla;

        //  ALFOMBRA RADIAL
        //  radioInt = 17.5, radioExt = 26.5, segmentos = 32
        material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.FrontSide,
            map: TEXTURES.REDCARPET
        });

        geometry = new PlatformBufferGeometry(17.5, 27.5, 32);

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
}

class TrialStands extends THREE.Object3D
{
    constructor()
    {
        super();

        var textura, material, geometry, malla,
            i, j, k;

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
}

Object.defineProperties(Courtroom, {
    TEXTURE_RELATIVE_URI: { value: '/resources/textures/' },
    CylinderBufferGeometry: { value: CylinderBufferGeometry },
    PlatformBufferGeometry: { value: PlatformBufferGeometry },
    StandGeometry: { value: StandGeometry },
    Floor: { value: Floor },
    Walls: { value: Walls },
    Exits: { value: Exits },
    Platform: { value: Platform },
    TrialStands: { value: TrialStands }
});

export default Courtroom