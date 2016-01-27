/* global THREE */

import Trial from '../src/Trial.js';
import Courtroom from '../src/Courtroom.js';
import Animation from '../src/Animation.js';

import Coordenada from '../src/Coordenada.js';

import SceneRenderer from '../src/SceneRenderer.js';
import HudRenderer from '../src/HudRenderer.js';

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
		{ id: "naegi",      name: "Makoto Naegi" },
		{ id: "yamada",     name: "Hifumi Yamada" },
		{ id: "fukawa",     name: "Touko Fukawa" },
		{ id: "kuwata",     name: "Leon Kuwata" },
		{ id: "celes",      name: "Celestia Ludenberg" },
		{ id: "togami",     name: "Byakuya Togami" },
		{ id: "fujisaki",   name: "Chihiro Fujisaki" },
		{ id: "hagakure",   name: "Yasuhiro Hagakure", sprite: 0 },
		null,
		{ id: "asahina",    name: "Aoi Asahina" },
		{ id: "oowada",     name: "Mondo Oowada" },
		{ id: "kirigiri",   name: "Kyouko Kirigiri" },
		{ id: "oogami",     name: "Sakura Oogami" },
		{ id: "enoshima",   name: "Junko Enoshima" },
		{ id: "ishimaru",   name: "Kiyotaka Ishimaru" },
		{ id: "maizono",    name: "Sayaka Maizono" }
	].forEach(juicio.setCharacter, juicio);

	juicio.putTheFuckingBear();
	juicio.setNarrator('Narrator');

	juicio.changeStage('discussion');

	juicio.stage.screen.setDialogue(juicio.characters.naegi, 'This is a very early preview test for the dangan-engine project. Press the button in the corner to start.', true);

	juicio.stage.justKeepRendering();

	document.querySelector('#boton').addEventListener('click', function () {
		juicio.loadScript("/example/demo_001_discussion.json");
	}, false);
}, false);