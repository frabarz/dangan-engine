/* global THREE */

import Promise from 'promise-polyfill';

import Trial from '../src/Trial.js';
import Courtroom from '../src/Courtroom.js';

import Animacion from '../src/Animacion.js';

import discusion from './demo.debate.js';

document.addEventListener('DOMContentLoaded', function() {
    var width = window.innerWidth,
        height = Math.floor(9 / 16 * width);

    if (height > window.innerHeight) {
        height = window.innerHeight;
        width = Math.floor(16 / 9 * height);
    }

    var juicio = new Trial(width, height);
    juicio.courtroom = new Courtroom();

    [
        { id: "naegi",      name: "Makoto Naegi" },
        { id: "maizono",    name: "Sayaka Maizono" },
        { id: "ishimaru",   name: "Kiyotaka Ishimaru" },
        { id: "enoshima",    name: "Junko Enoshima" },
        { id: "oogami",     name: "Sakura Oogami" },
        { id: "kirigiri",   name: "Kyouko Kirigiri" },
        { id: "oowada",     name: "Mondo Oowada" },
        { id: "asahina",    name: "Aoi Asahina" },
        null,
        { id: "hagakure",   name: "Yasuhiro Hagakure" },
        { id: "fujisaki",   name: "Chihiro Fujisaki" },
        { id: "togami",     name: "Byakuya Togami" },
        { id: "celes",      name: "Celestia Ludenberg" },
        { id: "kuwata",     name: "Leon Kuwata" },
        { id: "fukawa",     name: "Touko Fukawa" },
        { id: "yamada",     name: "Hifumi Yamada" }
    ].forEach(juicio.setCharacter, juicio);

    juicio
        .appendCanvasTo('body')
        .setupHUD('body');
    
    var screen; 

    function stop() {
        toggle = false;

        Animacion.stop();
        document.getElementById('boton').textContent = 'Reiniciar';

        new Animacion(juicio).tutorial();
        
        screen = juicio.changeStage('discussion');
        screen.speaker = 'narrator';
        screen.text = 'This is a very early preview test for the DRTrial project. Press the button in the corner to start.';
    }

    var toggle;
    document.getElementById('boton').addEventListener('click', function () {
        toggle = !toggle;

        if (toggle) {
            this.textContent = 'Detener';
            new Animacion(juicio)
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
}, false);