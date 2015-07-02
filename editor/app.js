angular.module('trial-editor', ['components'])
    //.service('InstructionsService', InstructionsService)
    .controller('CamaraController', CamaraController)
    .controller('TimelineController', TimelineController);

Promise.DOMContentLoaded()
.then(function() {
    "use strict";

    var videoHeight = Math.floor(window.innerHeight - 200),
        videoWidth = Math.floor(videoHeight * 16 / 9);
    
    document.getElementById('controles').style.marginLeft = (videoWidth + 15) + 'px';

    DR.Escenario.inicializar(videoWidth);
    DR.Escenario.construir(DR.escena);
    document.body.appendChild(DR.renderer.domElement);

    var video = document.querySelector('#video');
    video.height = videoHeight;
    video.width = videoWidth;

    document.addEventListener('keypress', function (e) {
        var stop;

        switch (e.keyCode) {
            case 32: //SPACE
                if (video.paused)
                    video.play();
                else
                    video.pause();
                stop = true;
                break;
            case 106: //j
            case 107: //k
                video.currentTime += (e.keyCode == 106 ? -0.1 : 0.1);
                stop = true;
                break;
            case 110: //n
            case 109: //m
                video.currentTime += (e.keyCode == 110 ? -1 : 1);
                stop = true;jjjj
                break;
        }

        if (stop) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
});
