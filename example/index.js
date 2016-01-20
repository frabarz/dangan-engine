/* global THREE */

import Promise from 'promise-polyfill';

import Trial from '../src/Trial.js';
import Courtroom from '../src/Courtroom.js';

import Animation from '../src/Animation.js';

import discusion from './demo.debate.js';

window.juicio = null;
window.pantalla = null;

document.addEventListener('DOMContentLoaded', function() {
	var juicio, pantalla,
		width = window.innerWidth,
        height = Math.floor(9 / 16 * width);

    if (height > window.innerHeight) {
        height = window.innerHeight;
        width = Math.floor(16 / 9 * height);
    }

	juicio = new Trial(width, height);
	juicio.scene.add(new Courtroom);

    [
        { id: "naegi",      name: "Makoto Naegi" },
		{ id: "yamada",     name: "Hifumi Yamada" },
        { id: "fukawa",     name: "Touko Fukawa" },
		{ id: "kuwata",     name: "Leon Kuwata" },
		{ id: "celes",      name: "Celestia Ludenberg" },
		{ id: "togami",     name: "Byakuya Togami" },
		{ id: "fujisaki",   name: "Chihiro Fujisaki" },
		{ id: "hagakure",   name: "Yasuhiro Hagakure" },
		null,
		{ id: "asahina",    name: "Aoi Asahina" },
		{ id: "oowada",     name: "Mondo Oowada" },
		{ id: "kirigiri",   name: "Kyouko Kirigiri" },
		{ id: "oogami",     name: "Sakura Oogami" },
		{ id: "enoshima",   name: "Junko Enoshima" },
		{ id: "ishimaru",   name: "Kiyotaka Ishimaru" },
		{ id: "maizono",    name: "Sayaka Maizono" }
    ].forEach(juicio.setCharacter, juicio);

    juicio
        .appendCanvasTo('body')
        .setupHUD('body');
    
    function stop() {
        toggle = false;

		juicio.animation.stop();
        document.getElementById('boton').textContent = 'Reiniciar';

		pantalla = juicio.changeStage('discussion');
		pantalla.setDialogue(juicio.characters.naegi, 'This is a very early preview test for the dangan-engine project. Press the button in the corner to start.');
        
		// juicio.animation.tutorial();
    }

    var toggle;
    document.getElementById('boton').addEventListener('click', function () {
        toggle = !toggle;

        if (toggle) {
            this.textContent = 'Detener';
			juicio.animation
                .tutorialToNSD()
                .iniciarNSD([
                    'Tsumiki’s Examination Results',
                    'Nidai’s Testimony',
                    'Mioda’s Testimony',
                    'Nanami’s Testimony',
                    'Souda’s Testimony'
                ])
                .loadScript(discusion)
                .delay(2000).promise
                .then(stop, function (e) {
                    stop();
                    console.error(e.stack);
                });
        } else {
            stop();
        }
    }, false);

    stop();

	window.juicio = juicio;
	window.pantalla = pantalla;

	ejecutarConversacionRandom();
}, false);

function ejecutarConversacionRandom() {
	var juicio = window.juicio;

	juicio.mainCamera.up.z = 5;
	setInterval(rotateDialogue, 10000);
	rotateDialogue();

	function rotateDialogue() {
		var transition,
			inicio,
			dir_x, dir_y,
			char = juicio.characters[Object.keys(juicio.characters)[Math.floor(Math.random() * 15)]],
			counter = char.card.counter;

		screen.setDialogue(char, 'I actually looked at the crime scene for more than 2 seconds, something you should try to do sometimes...');

		juicio.mainCamera.up.x = (Math.random() - 0.5) / 2;
		juicio.mainCamera.up.normalize();

		dir_x = 0.5 * (Math.random() - 0.5);
		dir_y = 10 * (Math.random() - 0.5);

		transition = function(t)
		{
			var delta = (t - inicio) / 10000,
				ang = 2 * Math.PI * (counter + dir_x * delta) / 16;

			juicio.mainCamera.position.set(
				(9 + dir_y * delta) * Math.cos(ang),
				(9 + dir_y * delta) * Math.sin(ang),
				16
			);

			juicio.mainCamera.lookAt({
				x: 25 * Math.cos(ang),
				y: 25 * Math.sin(ang),
				z: 16
			});

			juicio.render(t);
			Animation.step(transition);
		}

		juicio.animation.stop();
		inicio = window.performance.now() + 5000;
		Animation.step(transition);
	}
}