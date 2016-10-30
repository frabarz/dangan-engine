/* global THREE */

import Trial from '../../src/Trial.js';
import Courtroom from '../../src/Courtroom.js';
import Animation from '../../src/Animation.js';

import Coordenada from '../../src/Coordenada.js';

import SceneRenderer from '../../src/SceneRenderer.js';
import HudRenderer from '../../src/HudRenderer.js';

document.addEventListener('DOMContentLoaded', function() {
	let width = window.innerWidth,
		height = Math.floor(9 / 16 * width);

	if (height > window.innerHeight) {
		height = window.innerHeight;
		width = Math.floor(16 / 9 * height);
	}

	let juicio = new Trial(width, height);

	let scene = new SceneRenderer(width, height);
	scene.createCamera();
	scene.addElement(new Courtroom);
	juicio.setupRenderer('scene', scene)
	document.querySelector('body').appendChild(scene.canvas);

	let hud = new HudRenderer(width, height);
	juicio.setupRenderer('hud', hud);
	document.querySelector('body').appendChild(hud.canvas);

	[
		{ id: "makoto",		name: "Makoto Naegi" },
		{ id: "hifumi",		name: "Hifumi Yamada" },
		{ id: "touko",		name: "Touko Fukawa" },
		{ id: "leon",		name: "Leon Kuwata" },
		{ id: "celes",		name: "Celestia Ludenberg" },
		{ id: "byakuya",	name: "Byakuya Togami" },
		{ id: "chihiro",	name: "Chihiro Fujisaki" },
		{ id: "yasuhiro",	name: "Yasuhiro Hagakure"},
		null,
		{ id: "aoi",		name: "Aoi Asahina" },
		{ id: "mondo",		name: "Mondo Oowada" },
		{ id: "kyouko",		name: "Kyouko Kirigiri" },
		{ id: "sakura",		name: "Sakura Oogami" },
		{ id: "junko",		name: "Junko Enoshima" },
		{ id: "kiyotaka",	name: "Kiyotaka Ishimaru" },
		{ id: "sayaka",		name: "Sayaka Maizono" }
	].forEach(juicio.setCharacter, juicio);

	juicio.putTheFuckingBear();
	juicio.setNarrator('Narrator');

	juicio.changeStage('discussion');

	juicio.stage.screen.setDialogue(juicio.characters.makoto, 'This is a very early preview test for the dangan-engine project. Press the button in the corner to start.', true);

	juicio.stage.justKeepRendering();

	document.querySelector('#boton').addEventListener('click', function () {
		juicio.loadScript("demo_001_discussion.json");
	}, false);
}, false);
